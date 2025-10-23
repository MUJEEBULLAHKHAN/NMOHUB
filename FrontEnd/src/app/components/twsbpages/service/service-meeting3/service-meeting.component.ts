import { Component, Input, input, TemplateRef, viewChild, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../../../shared/services/twsbservices/job.service';
import { ActivatedRoute } from '@angular/router';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { WorkshopCourtesyCarsService } from '../../../../shared/services/twsbservices/workshop-courtesy-cars.service';
import { CourtesyCarLog } from '../../../../models/WorkShopCourtesyCars';
import { NMOService } from '../../../../shared/services/new.service';
import { RequestList } from '../../../../models/new-service';
import { th } from 'date-fns/locale';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-meeting',
  standalone: false,
  // imports: [],
  templateUrl: './service-meeting.component.html',
  styleUrl: './service-meeting.component.scss'
})




export class ServiceMeetingComponent implements OnChanges {


  constructor(config: NgbAccordionConfig,
    private jobService: NMOService,
    private route: ActivatedRoute,
    private toaster: DisplaymessageComponent,
    private referenceService: ReferenceService,
    private workshopCourtesyCarsService: WorkshopCourtesyCarsService,
    private modalService: NgbModal) {
    //config.closeOthers = true;
    document.querySelector('.single-page-header')?.classList.add('d-none');

  }
currentView: 'week' | 'month' | 'year' = 'week';
  currentDate: Date = new Date();
  currentWeekDays: Date[] = [];
  monthWeeks: Date[][] = [];
  yearMonths: Date[] = [];
  selectedSlots: { date: Date; time: string }[] = [];
  showBookingForm: boolean = false;
  newBooking: { title: string; type: 'gray' | 'green'; duration: number } = { title: '', type: 'gray', duration: 1 };
  

  timeSlots = [
    '6am', '7am', '8am', '9am', '10am', '11am', 
    '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'
  ];
  
  weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  weekDayAbbrev = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  events: any[] = [
    {
      id: '1',
      title: 'angielski',
      startTime: '6:00',
      endTime: '7:00',
      date: new Date(2025, 7, 1), // April 1, 2019
      type: 'gray'
    },
    {
      id: '1',
      title: 'angielski',
      startTime: '7:00',
      endTime: '8:00',
      date: new Date(2025, 7, 1), // April 1, 2019
      type: 'gray'
    },
    {
      id: '2',
      title: 'lekcja pianina',
      startTime: '8:00',
      endTime: '9:00',
      date: new Date(2025, 7, 2), // April 2, 2019
      type: 'gray'
    },
    {
      id: '3',
      title: 'angielski',
      startTime: '8:00',
      endTime: '9:00',
      date: new Date(2025, 7, 4), // April 4, 2019
      type: 'gray'
    },
    {
      id: '4',
      title: 'lekcja francuskiego',
      startTime: '8:00',
      endTime: '9:00',
      date: new Date(2025, 7, 5), // April 5, 2019
      type: 'green'
    },
    {
      id: '5',
      title: 'angielski',
      startTime: '8:00',
      endTime: '9:00',
      date: new Date(2025, 7, 6), // April 6, 2019
      type: 'green'
    },
    {
      id: '6',
      title: 'angielski',
      startTime: '9:00',
      endTime: '10:00',
      date: new Date(2025, 7, 6), // April 6, 2019
      type: 'green'
    },
    {
      id: '7',
      title: 'lekcja pianina',
      startTime: '10:00',
      endTime: '11:00',
      date: new Date(2025, 7, 4), // April 4, 2019
      type: 'gray'
    },
    {
      id: '8',
      title: 'angielski',
      startTime: '11:00',
      endTime: '12:00',
      date: new Date(2025, 7, 6), // April 6, 2019
      type: 'green'
    },
    {
      id: '9',
      title: 'lekcja francuskiego',
      startTime: '14:00',
      endTime: '15:00',
      date: new Date(2025, 7, 3), // April 3, 2019
      type: 'gray'
    },
    {
      id: '10',
      title: 'Ashfak',
      startTime: '16:00',
      endTime: '17:00',
      date: new Date(2025, 7, 5), // April 5, 2019
      type: 'green'
    }
  ];

  
  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }


  ngOnInit() {
    this.updateCalendarData();
  }

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
    
    // Start from Monday of the week containing the first day
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
    const dayName = days[date.getDay()];
    return `${dayName} ${date.getMonth() + 1}/${date.getDate()}`;
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
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };
    
    const targetHour = timeMap[timeSlot];
    
    return this.events.filter(event => {
      const eventDate = event.date;
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);
      
      // Check if the target hour falls within the event's time range
      return this.isSameDay(eventDate, date) && 
             targetHour >= eventStartHour && 
             targetHour < eventEndHour;
    });
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
    // Check if slot is empty
    if (this.getEventsForDayAndTime(date, time).length === 0) {
      // Check if this slot is already selected
      const existingIndex = this.selectedSlots.findIndex(slot => 
        this.isSameDay(slot.date, date) && slot.time === time
      );
      
      if (existingIndex > -1) {
        // Deselect the slot
        this.selectedSlots.splice(existingIndex, 1);
      } else {
        // Add new slot and sort by time
        this.selectedSlots.push({ date, time });
        this.sortSelectedSlots();
      }
      
      // Open booking form if we have selected slots
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

  private sortSelectedSlots() {
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };
    
    this.selectedSlots.sort((a, b) => {
      const timeA = timeMap[a.time];
      const timeB = timeMap[b.time];
      return timeA - timeB;
    });
  }

  getSelectedSlotsInfo() {
    if (this.selectedSlots.length === 0) {
      return { date: new Date(), timeRange: '' };
    }
    
    const firstSlot = this.selectedSlots[0];
    const lastSlot = this.selectedSlots[this.selectedSlots.length - 1];
    
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };
    
    const startHour = timeMap[firstSlot.time];
    const endHour = timeMap[lastSlot.time] + 1;
    
    return {
      date: firstSlot.date,
      timeRange: `${firstSlot.time} - ${this.formatHour(endHour)}`
    };
  }

  private formatHour(hour: number): string {
    if (hour <= 12) {
      return hour === 12 ? '12pm' : `${hour}am`;
    } else {
      return `${hour - 12}pm`;
    }
  }

  updateSelectedSlots() {
    if (this.selectedSlots.length === 0) return;
    
    const firstSlot = this.selectedSlots[0];
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };
    
    const reverseTimeMap: { [key: number]: string } = {
      6: '6am', 7: '7am', 8: '8am', 9: '9am', 10: '10am', 11: '11am',
      12: '12pm', 13: '1pm', 14: '2pm', 15: '3pm', 16: '4pm', 17: '5pm'
    };
    
    // Clear current selection and rebuild based on duration
    this.selectedSlots = [];
    const startHour = timeMap[firstSlot.time];
    
    // Only add slots that are available (not occupied by existing events)
    for (let i = 0; i < this.newBooking.duration; i++) {
      const currentHour = startHour + i;
      if (reverseTimeMap[currentHour]) {
        // Check if this slot is available
        const timeSlot = reverseTimeMap[currentHour];
        const existingEvents = this.getEventsForDayAndTime(firstSlot.date, timeSlot);
        
        if (existingEvents.length === 0) {
          this.selectedSlots.push({
            date: firstSlot.date,
            time: timeSlot
          });
        }
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
      const timeMap: { [key: string]: number } = {
        '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
        '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
      };
      
      const firstSlot = this.selectedSlots[0];
      const startHour = timeMap[firstSlot.time];
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
}
