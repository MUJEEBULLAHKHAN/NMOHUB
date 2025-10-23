import { Component, TemplateRef, ViewChild, SimpleChanges } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView, DateAdapter, } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { BookingSlot, MeetingSlotRequest, Event } from '../../../../models/new-service';
import { AppointmentService } from '../../../../shared/services/twsbservices/appointment.service';
import { NMOService } from '../../../../shared/services/new.service';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

interface Color {
  primary: string;
  secondary: string;
}

// Centralized Time Management Class
class TimeManager {
  // Available time slots in 12-hour format
  static readonly TIME_SLOTS: string[] = [
    '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  // Mapping from display format to 24-hour format
  private static readonly DISPLAY_TO_24H_MAP: { [key: string]: number } = {
    '6 AM': 6, '7 AM': 7, '8 AM': 8, '9 AM': 9, '10 AM': 10, '11 AM': 11,
    '12 PM': 12, '1 PM': 13, '2 PM': 14, '3 PM': 15, '4 PM': 16, '5 PM': 17,
    '6 PM': 18, '7 PM': 19, '8 PM': 20, '9 PM': 21, '10 PM': 22, '11 PM': 23
  };

  // Reverse mapping from 24-hour to display format
  private static readonly H24_TO_DISPLAY_MAP: { [key: number]: string } = {
    6: '6 AM', 7: '7 AM', 8: '8 AM', 9: '9 AM', 10: '10 AM', 11: '11 AM',
    12: '12 PM', 13: '1 PM', 14: '2 PM', 15: '3 PM', 16: '4 PM', 17: '5 PM',
    18: '6 PM', 19: '7 PM', 20: '8 PM', 21: '9 PM', 22: '10 PM', 23: '11 PM'
  };

  static getTimeSlots(): string[] {
    return [...this.TIME_SLOTS];
  }

  static convertDisplayTo24Hour(displayTime: string): number {
    return this.DISPLAY_TO_24H_MAP[displayTime] || 0;
  }

  static convert24HourToDisplay(hour: number): string {
    return this.H24_TO_DISPLAY_MAP[hour] || '';
  }

  static convertToTimeSpanFormat(timeStr: string): string {
    const hour24 = this.convertDisplayTo24Hour(timeStr);
    return `${hour24.toString().padStart(2, '0')}:00:00`;
  }

  static formatTimeFromTimeSpan(timeSpan: string): string {
    // timeSpan is like "11:00:00"
    const [hourStr] = timeSpan.split(':');
    const hour = parseInt(hourStr, 10);
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  static getNextTimeSlot(currentTime: string): string | null {
    const currentIndex = this.TIME_SLOTS.indexOf(currentTime);
    if (currentIndex >= 0 && currentIndex < this.TIME_SLOTS.length - 1) {
      return this.TIME_SLOTS[currentIndex + 1];
    }
    return null;
  }

  static getPreviousTimeSlot(currentTime: string): string | null {
    const currentIndex = this.TIME_SLOTS.indexOf(currentTime);
    if (currentIndex > 0) {
      return this.TIME_SLOTS[currentIndex - 1];
    }
    return null;
  }

  static isValidTimeSlot(timeSlot: string): boolean {
    return this.TIME_SLOTS.includes(timeSlot);
  }
}

const colors: { [key: string]: Color } = {
  red: { primary: '#ad2121', secondary: '#ad2121' },
  blue: { primary: '#1e90ff', secondary: '#1e90ff' },
  green: { primary: '#32cd32', secondary: '#32cd32' },
  yellow: { primary: '#ffc107', secondary: '#ffc107' },
  purple: { primary: '#8f44ad', secondary: '#8f44ad' },
  orange: { primary: '#ff8c00', secondary: '#ff8c00' },
  pink: { primary: '#ff69b4', secondary: '#ff69b4' },
  brown: { primary: '#a0522d', secondary: '#a0522d' },
  gray: { primary: '#808080', secondary: '#808080' },
  teal: { primary: '#008080', secondary: '#008080' },
  lime: { primary: '#90ee90', secondary: '#90ee90' },
  indigo: { primary: '#4b0082', secondary: '#4b0082' },
  violet: { primary: '#ee82ee', secondary: '#ee82ee' },
  magenta: { primary: '#ff00ff', secondary: '#ff00ff' },
  cyan: { primary: '#00ffff', secondary: '#00ffff' },
};

const SINGLE_COLORS = [
  'primary', 'secondary', 'success', 'info', 'warning', 'danger', 'teal'
];

const colorNames = Object.keys(colors);

function getSingleColor(): string {
  const randomIndex = Math.floor(Math.random() * SINGLE_COLORS.length);
  return SINGLE_COLORS[randomIndex];
}

@Component({
  selector: 'app-calender-schedule-admin',
  standalone: false,
  providers: [DisplaymessageComponent, DatePipe],
  templateUrl: './calender-schedule-admin.component.html',
  styleUrl: './calender-schedule-admin.component.scss'
})
export class CalenderScheduleAdminComponent {

  dateList: string[] = [];
  appointments: any;
  appointment: any;
  vehicleMakes: any[] = [];
  vehicleModels: any[] = [];
  showLoader: boolean = false;
  isMeetingRoomOne: boolean = false;
  isMeetingRoomTwo: boolean = false;
  meetingSlotRequestList: MeetingSlotRequest[] = [];

  @ViewChild('modalAddSlotPopUp') modalAddSlotPopUp: TemplateRef<any> | undefined;

  // Use centralized time management
  timeSlots: string[] = TimeManager.getTimeSlots();

  bookingSlot = new BookingSlot();
  slotList: any[] = [];
  events: Event[] = [];
  filteredSlots: any[] = [];

  // Calendar view properties
  currentView: 'week' | 'month' | 'year' = 'week';
  currentDate: Date = new Date();
  currentWeekDays: Date[] = [];
  monthWeeks: Date[][] = [];
  yearMonths: Date[] = [];
  selectedSlots: { date: Date; time: string }[] = [];
  showBookingForm: boolean = false;
  newBooking: { title: string; type: 'gray' | 'green'; duration: number } = {
    title: '', type: 'gray', duration: 1
  };

  weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  weekDayAbbrev = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  constructor(
    private modal: NgbModal,
    private referenceService: ReferenceService,
    private toaster: DisplaymessageComponent,
    private appointmentService: AppointmentService,
    private modalService: NgbModal,
    private nmoService: NMOService,
    private datePipe: DatePipe
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngAfterViewInit() { }

  ngOnChanges(changes: SimpleChanges) { }

  ngOnInit() {
    this.updateCalendarData();
    this.GetAllMeetingSlotsAsync();
  }

  AddMeetingSlot() {
    this.modalService.open(this.modalAddSlotPopUp, { backdrop: 'static' });
  }

  CloseSlotPopUp() {
    this.resetSlotForm();
    this.modalService.dismissAll();
  }

  SelectSlot(slot: any) {
    const existingIndex = this.slotList.findIndex(x => x === slot);
    if (existingIndex <= -1) {
      this.slotList.push(slot);
    } else {
      this.slotList.splice(existingIndex, 1);
    }
  }

  generateDateList(start: Date, end: Date) {
    this.dateList = [];
    const date = new Date(start);
    const endDate = new Date(end);

    while (date <= endDate) {
      this.dateList.push(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
      date.setDate(date.getDate() + 1);
    }
  }

  SubmitSlot() {
    if (!this.bookingSlot.startDate || !this.bookingSlot.endDate) {
      this.toaster.displayErrorMessage('NMO', 'Please select Start Date and End Date.');
      return;
    }

    if (!this.slotList || this.slotList.length === 0) {
      this.toaster.displayErrorMessage('NMO', 'Please select at least one time slot.');
      return;
    }

    if (this.isMeetingRoomOne == false && this.isMeetingRoomTwo == false) {
      this.toaster.displayErrorMessage('NMO', 'Please select at least one Meeting Room.');
      return;
    }

    this.dateList = [];
    this.meetingSlotRequestList = [];

    this.generateDateList(this.bookingSlot.startDate, this.bookingSlot.endDate);

    this.dateList.forEach((date) => {
      this.slotList.forEach((slot) => {

        if (this.isMeetingRoomOne == true && this.isMeetingRoomTwo == true) {

          // For Room One

          const timespanValue = TimeManager.convertToTimeSpanFormat(slot);
          const slots = {
            "SlotDate": new Date(date),
            "StartTime": timespanValue,
            "IsMeetingRoomOne": this.isMeetingRoomOne,
            "IsMeetingRoomTwo": false
          };
          this.meetingSlotRequestList.push(slots);

          // For Room Two

          const timespanValue1 = TimeManager.convertToTimeSpanFormat(slot);
          const slots1 = {
            "SlotDate": new Date(date),
            "StartTime": timespanValue1,
            "IsMeetingRoomOne": false,
            "IsMeetingRoomTwo": this.isMeetingRoomTwo
          };
          this.meetingSlotRequestList.push(slots1);

        }

        if (this.isMeetingRoomOne == true && this.isMeetingRoomTwo == false) {
          const timespanValue = TimeManager.convertToTimeSpanFormat(slot);
          const slots = {
            "SlotDate": new Date(date),
            "StartTime": timespanValue,
            "IsMeetingRoomOne": this.isMeetingRoomOne,
            "IsMeetingRoomTwo": this.isMeetingRoomTwo
          };
          this.meetingSlotRequestList.push(slots);
        }

        if (this.isMeetingRoomOne == false && this.isMeetingRoomTwo == true) {
          const timespanValue = TimeManager.convertToTimeSpanFormat(slot);
          const slots = {
            "SlotDate": new Date(date),
            "StartTime": timespanValue,
            "IsMeetingRoomOne": this.isMeetingRoomOne,
            "IsMeetingRoomTwo": this.isMeetingRoomTwo
          };
          this.meetingSlotRequestList.push(slots);
        }
      });
    });

    this.showLoader = true;
    this.nmoService.GenerateMeetingSlot(this.meetingSlotRequestList).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.resetSlotForm();
          this.modalService.dismissAll();
          this.GetAllMeetingSlotsAsync();
        } else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
          this.showLoader = false;
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', error.error.message);
        this.showLoader = false;
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  resetSlotForm() {
    this.bookingSlot = new BookingSlot();
    this.slotList = [];
    this.dateList = [];
    this.meetingSlotRequestList = [];
    this.isMeetingRoomOne = false;
    this.isMeetingRoomTwo = false;
  }

  GetAllMeetingSlotsAsync() {
    this.showLoader = true;
    this.nmoService.GetAllMeetingSlots().subscribe({
      next: (user) => {
        if (user.body.success) {
          this.events = user.body.data;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          this.filteredSlots = this.events.filter(slot => {
            const slotDate = new Date(slot.date);
            return slotDate >= today;
          });
        } else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
          this.showLoader = false;
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', error.error.message);
        this.showLoader = false;
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  // Calendar navigation methods
  setView(view: 'week' | 'month' | 'year') {
    this.currentView = view;
    this.updateCalendarData();
  }

  navigateNext() {
    switch (this.currentView) {
      case 'week':
        this.currentDate = new Date(this.currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        break;
      case 'year':
        this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0, 1);
        break;
    }
    this.updateCalendarData();
  }

  navigatePrevious() {
    switch (this.currentView) {
      case 'week':
        this.currentDate = new Date(this.currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        break;
      case 'year':
        this.currentDate = new Date(this.currentDate.getFullYear() - 1, 0, 1);
        break;
    }
    this.updateCalendarData();
  }

  goToToday() {
    this.currentDate = new Date();
    this.updateCalendarData();
  }

  private updateCalendarData() {
    switch (this.currentView) {
      case 'week':
        this.generateWeekDays();
        break;
      case 'month':
        this.generateMonthWeeks();
        break;
      case 'year':
        this.generateYearMonths();
        break;
    }
  }

  private generateWeekDays() {
    const startOfWeek = new Date(this.currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
    startOfWeek.setDate(diff);

    this.currentWeekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.currentWeekDays.push(date);
    }
  }

  private generateMonthWeeks() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    const day = startDate.getDay();
    startDate.setDate(startDate.getDate() - (day === 0 ? 6 : day - 1));

    this.monthWeeks = [];
    let currentDate = new Date(startDate);

    while (currentDate <= lastDay || this.monthWeeks.length < 6) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.monthWeeks.push(week);

      if (currentDate.getMonth() !== month && this.monthWeeks.length >= 4) {
        break;
      }
    }
  }

  private generateYearMonths() {
    const year = this.currentDate.getFullYear();
    this.yearMonths = [];
    for (let i = 0; i < 12; i++) {
      this.yearMonths.push(new Date(year, i, 1));
    }
  }

  getMonthWeeks(month: Date): Date[][] {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    const startDate = new Date(firstDay);
    const day = startDate.getDay();
    startDate.setDate(startDate.getDate() - (day === 0 ? 6 : day - 1));

    const weeks: Date[][] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= lastDay || weeks.length < 5) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);

      if (currentDate.getMonth() !== monthIndex && weeks.length >= 4) {
        break;
      }
    }

    return weeks;
  }

  formatDayHeader(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    return `${dayName} ${date.getDate()} / ${monthName}`;
  }

  getDateRangeDisplay(): string {
    switch (this.currentView) {
      case 'week':
        const start = this.currentWeekDays[0];
        const end = this.currentWeekDays[6];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
      case 'month':
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
      case 'year':
        return `${this.currentDate.getFullYear()}`;
      default:
        return '';
    }
  }

  getMonthName(date: Date): string {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[date.getMonth()];
  }

  getEventsForDayAndTime(date: Date, timeSlot: string): any[] {
    const targetHour = TimeManager.convertDisplayTo24Hour(timeSlot);

    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);

      return this.isSameDay(eventDate, date) && targetHour === eventStartHour;
    });
  }

  formatTime(time: string): string {
    return TimeManager.formatTimeFromTimeSpan(time);
  }

  getEventsForDay(date: Date): any[] {
    return this.events.filter(event => this.isSameDay(event.date, date));
  }

  hasEventsOnDay(date: Date): boolean {
    return this.events.some(event => this.isSameDay(event.date, date));
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  isSameMonth(date: Date, referenceDate: Date): boolean {
    return date.getMonth() === referenceDate.getMonth() &&
      date.getFullYear() === referenceDate.getFullYear();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  selectTimeSlot(date: Date, time: string) {
    if (!this.isSlotOccupied(date, time)) {
      const existingIndex = this.selectedSlots.findIndex(slot =>
        this.isSameDay(slot.date, date) && slot.time === time
      );

      if (existingIndex > -1) {
        this.selectedSlots.splice(existingIndex, 1);
      } else {
        this.selectedSlots.push({ date, time });
        this.sortSelectedSlots();
      }

      if (this.selectedSlots.length > 0) {
        this.showBookingForm = true;
        this.newBooking.duration = this.selectedSlots.length;
      } else {
        this.closeBookingForm();
      }
    }
  }

  isSlotSelected(date: Date, time: string): boolean {
    return this.selectedSlots.some(slot =>
      this.isSameDay(slot.date, date) && slot.time === time
    );
  }

  isMergedSlot(date: Date, time: string): boolean {
    const targetHour = TimeManager.convertDisplayTo24Hour(time);

    return this.events.some(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      return this.isSameDay(eventDate, date) &&
        targetHour > eventStartHour &&
        targetHour < eventEndHour;
    });
  }

  isMergedSlotStart(date: Date, time: string): boolean {
    const targetHour = TimeManager.convertDisplayTo24Hour(time);

    return this.events.some(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      return this.isSameDay(eventDate, date) &&
        targetHour === eventStartHour &&
        eventEndHour > eventStartHour;
    });
  }

  isMergedSlotMiddle(date: Date, time: string): boolean {
    const targetHour = TimeManager.convertDisplayTo24Hour(time);

    return this.events.some(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      return this.isSameDay(eventDate, date) &&
        targetHour > eventStartHour &&
        targetHour < eventEndHour - 1;
    });
  }

  isMergedSlotEnd(date: Date, time: string): boolean {
    const targetHour = TimeManager.convertDisplayTo24Hour(time);

    return this.events.some(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      return this.isSameDay(eventDate, date) &&
        targetHour === eventEndHour - 1 &&
        eventEndHour > eventStartHour;
    });
  }

  // Selected slot merging functions
  isSelectedSlotMerged(date: Date, time: string): boolean {
    return this.isSelectedSlotStart(date, time) ||
      this.isSelectedSlotMiddle(date, time) ||
      this.isSelectedSlotEnd(date, time);
  }

  isSelectedSlotStart(date: Date, time: string): boolean {
    if (!this.isSlotSelected(date, time)) return false;

    const nextTimeSlot = TimeManager.getNextTimeSlot(time);
    return nextTimeSlot ? this.isSlotSelected(date, nextTimeSlot) : false;
  }

  isSelectedSlotMiddle(date: Date, time: string): boolean {
    if (!this.isSlotSelected(date, time)) return false;

    const prevTimeSlot = TimeManager.getPreviousTimeSlot(time);
    const nextTimeSlot = TimeManager.getNextTimeSlot(time);

    return !!(prevTimeSlot && nextTimeSlot &&
      this.isSlotSelected(date, prevTimeSlot) &&
      this.isSlotSelected(date, nextTimeSlot));
  }

  isSelectedSlotEnd(date: Date, time: string): boolean {
    if (!this.isSlotSelected(date, time)) return false;

    const prevTimeSlot = TimeManager.getPreviousTimeSlot(time);
    const nextTimeSlot = TimeManager.getNextTimeSlot(time);

    return !!(prevTimeSlot && this.isSlotSelected(date, prevTimeSlot) &&
      (!nextTimeSlot || !this.isSlotSelected(date, nextTimeSlot)));
  }

  isSlotOccupied(date: Date, time: string): boolean {
    const targetHour = TimeManager.convertDisplayTo24Hour(time);

    return this.events.some(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      return this.isSameDay(eventDate, date) &&
        targetHour >= eventStartHour &&
        targetHour < eventEndHour;
    });
  }

  private sortSelectedSlots() {
    this.selectedSlots.sort((a, b) => {
      const timeA = TimeManager.convertDisplayTo24Hour(a.time);
      const timeB = TimeManager.convertDisplayTo24Hour(b.time);
      return timeA - timeB;
    });
  }

  getSelectedSlotsInfo() {
    if (this.selectedSlots.length === 0) {
      return { date: new Date(), timeRange: '' };
    }

    const firstSlot = this.selectedSlots[0];
    const lastSlot = this.selectedSlots[this.selectedSlots.length - 1];

    const startHour = TimeManager.convertDisplayTo24Hour(firstSlot.time);
    const endHour = TimeManager.convertDisplayTo24Hour(lastSlot.time) + 1;
    const endTimeDisplay = TimeManager.convert24HourToDisplay(endHour);

    return {
      date: firstSlot.date,
      timeRange: `${firstSlot.time} - ${endTimeDisplay || this.formatHour(endHour)}`
    };
  }

  private formatHour(hour: number): string {
    if (hour <= 12) {
      return hour === 12 ? '12 PM' : `${hour} AM`;
    } else {
      return `${hour - 12} PM`;
    }
  }

  updateSelectedSlots() {
    if (this.selectedSlots.length === 0) return;

    const firstSlot = this.selectedSlots[0];
    const startHour = TimeManager.convertDisplayTo24Hour(firstSlot.time);

    // Clear current selection and rebuild based on duration
    this.selectedSlots = [];

    // Only add slots that are available (not occupied by existing events)
    for (let i = 0; i < this.newBooking.duration; i++) {
      const currentHour = startHour + i;
      const timeSlot = TimeManager.convert24HourToDisplay(currentHour);

      if (timeSlot && !this.isSlotOccupied(firstSlot.date, timeSlot)) {
        this.selectedSlots.push({
          date: firstSlot.date,
          time: timeSlot
        });
      }
    }

    // Update the duration to match actual selected slots
    this.newBooking.duration = this.selectedSlots.length;
  }

  getEventHeight(event: any): number {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const duration = endHour - startHour;
    return duration * 50; // 50px per hour
  }

  createBooking() {
    if (this.selectedSlots.length > 0 && this.newBooking.title.trim()) {
      const firstSlot = this.selectedSlots[0];
      const startHour = TimeManager.convertDisplayTo24Hour(firstSlot.time);
      const endHour = startHour + this.newBooking.duration;

      const newEvent: any = {
        id: Date.now().toString(),
        title: this.newBooking.title,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        date: new Date(firstSlot.date),
        type: this.newBooking.type
      };

      this.events.push(newEvent);
      this.closeBookingForm();
    }
  }

  closeBookingForm() {
    this.showBookingForm = false;
    this.selectedSlots = [];
    this.newBooking = { title: '', type: 'gray', duration: 1 };
  }

  // Additional utility methods for better time management
  getTimeSlotIndex(timeSlot: string): number {
    return TimeManager.getTimeSlots().indexOf(timeSlot);
  }

  isValidTimeRange(startTime: string, endTime: string): boolean {
    const startIndex = this.getTimeSlotIndex(startTime);
    const endIndex = this.getTimeSlotIndex(endTime);
    return startIndex >= 0 && endIndex >= 0 && endIndex > startIndex;
  }

  getTimeSlotsInRange(startTime: string, endTime: string): string[] {
    const startIndex = this.getTimeSlotIndex(startTime);
    const endIndex = this.getTimeSlotIndex(endTime);

    if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
      return TimeManager.getTimeSlots().slice(startIndex, endIndex);
    }
    return [];
  }

  // Event duration calculation
  calculateEventDuration(event: any): number {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    return endHour - startHour;
  }

  // Check if time slot is within business hours (optional)
  isWithinBusinessHours(timeSlot: string): boolean {
    const hour = TimeManager.convertDisplayTo24Hour(timeSlot);
    return hour >= 6 && hour <= 23; // 6 AM to 11 PM
  }

  // Get available slots for a specific date
  getAvailableSlotsForDate(date: Date): string[] {
    return TimeManager.getTimeSlots().filter(timeSlot =>
      !this.isSlotOccupied(date, timeSlot)
    );
  }

  // Get occupied slots for a specific date
  getOccupiedSlotsForDate(date: Date): string[] {
    return TimeManager.getTimeSlots().filter(timeSlot =>
      this.isSlotOccupied(date, timeSlot)
    );
  }

  // Validate slot selection for booking
  validateSlotSelection(): { valid: boolean; message: string } {
    if (this.selectedSlots.length === 0) {
      return { valid: false, message: 'Please select at least one time slot.' };
    }

    // Check if all selected slots are on the same date
    const firstDate = this.selectedSlots[0].date;
    const allSameDate = this.selectedSlots.every(slot =>
      this.isSameDay(slot.date, firstDate)
    );

    if (!allSameDate) {
      return { valid: false, message: 'All selected slots must be on the same date.' };
    }

    // Check if slots are consecutive
    const sortedSlots = [...this.selectedSlots].sort((a, b) =>
      TimeManager.convertDisplayTo24Hour(a.time) - TimeManager.convertDisplayTo24Hour(b.time)
    );

    for (let i = 1; i < sortedSlots.length; i++) {
      const currentHour = TimeManager.convertDisplayTo24Hour(sortedSlots[i].time);
      const previousHour = TimeManager.convertDisplayTo24Hour(sortedSlots[i - 1].time);

      if (currentHour !== previousHour + 1) {
        return { valid: false, message: 'Selected time slots must be consecutive.' };
      }
    }

    return { valid: true, message: '' };
  }

  // Clear all selections
  clearAllSelections() {
    this.selectedSlots = [];
    this.showBookingForm = false;
    this.newBooking = { title: '', type: 'gray', duration: 1 };
  }

  // Get time slot display with proper formatting
  getTimeSlotDisplay(timeSlot: string): string {
    return TimeManager.isValidTimeSlot(timeSlot) ? timeSlot : 'Invalid Time';
  }
}