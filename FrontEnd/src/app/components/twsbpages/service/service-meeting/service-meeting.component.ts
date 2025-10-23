import { Component, Input, input, TemplateRef, viewChild, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../../../shared/services/twsbservices/job.service';
import { ActivatedRoute } from '@angular/router';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { WorkshopCourtesyCarsService } from '../../../../shared/services/twsbservices/workshop-courtesy-cars.service';
import { CourtesyCarLog } from '../../../../models/WorkShopCourtesyCars';
import { NMOService } from '../../../../shared/services/new.service';
import { RequestList, ScheduleMeetingModel } from '../../../../models/new-service';
import { th } from 'date-fns/locale';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingSlot, MeetingSlotRequest, Event } from '../../../../models/new-service';
import { DatePipe } from '@angular/common';
import { ProjectRequestResponse } from '../../../../models/request.service';



@Component({
  selector: 'app-service-meeting',
  standalone: false,
  // imports: [],
  providers: [DatePipe],

  templateUrl: './service-meeting.component.html',
  styleUrl: './service-meeting.component.scss'
})




export class ServiceMeetingComponent implements OnChanges {

  employeeId: any;
  currentUrl = window.location.pathname; // Getting the full URL
  role!: string;
  roleId!: number;
  serviceRequestDetails = new ProjectRequestResponse();

  constructor(config: NgbAccordionConfig,
    private jobService: NMOService,
    private route: ActivatedRoute,
    private toaster: DisplaymessageComponent,
    private referenceService: ReferenceService,
    private workshopCourtesyCarsService: WorkshopCourtesyCarsService,
    private modalService: NgbModal,
    private nmoService: NMOService,
    private datePipe: DatePipe) {
    //config.closeOthers = true;
    document.querySelector('.single-page-header')?.classList.add('d-none');

    if (this.currentUrl !== "/customer-project-track") {
      this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
      this.employeeId = this._userInfo.employeeId;

      var roles = JSON.parse(localStorage.getItem('roles') ?? '');
      console.log("Role INFO IS ", roles);
      this.role = roles[0].name;
      this.roleId = roles[0].id;

    } else {
      this.employeeId = 0;
      this.roleId = 1;
    }

  }

  showLoader: boolean = false;
  events: Event[] = [];
  //timeSlots: any[] = [];
  filteredSlots: any[] = [];
  scheduleMeetingModel = new ScheduleMeetingModel();
  startTime: any;
  endTime: any;
  platFormOptions: any = ["Google Meet", "Zoom", "Teams"];
  serviceId: any;
  projectId: any;
  _userInfo: any;
  /////////////////////////////////////////
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


  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }


  ngOnInit() {
    //this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const serviceId = this.route.snapshot.queryParamMap.get('serv');
    this.projectId = idParam;
    this.serviceId = serviceId;
    this.updateCalendarData();
    this.GetAllMeetingSlotsAsync();

    if (this.currentUrl === "/customer-project-track") {
      this.GetProjectRequestDetailsbyProjectRequestid();
    }
  }


  GetProjectRequestDetailsbyProjectRequestid() {
    const idParam = this.route.snapshot.queryParamMap.get('id');

    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }
    this.jobService.GetEmployeeIdByProjectId(id, this.serviceId).subscribe({
      next: (data) => {
        this.employeeId = data.body.data;
        //this.GetProjectStatus();

        console.log('Service Request Details:', this.serviceRequestDetails);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }



  GetAllMeetingSlotsAsync() {
    this.showLoader = true;
    this.nmoService.GetAllMeetingSlots().subscribe({
      next: (user) => {
        if (user.body.success) {
          this.timeSlots = [
            '6am', '7am', '8am', '9am', '10am', '11am',
            '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '7pm', '8pm', '9pm', '10pm', '11pm'
          ];
          this.events = user.body.data;

          const today = new Date();
          today.setHours(0, 0, 0, 0); // remove time part

          this.filteredSlots = this.events.filter(slot => {
            const slotDate = new Date(slot.date);
            return slotDate >= today;
          });

          // this.updateCalendarData();
          //this.GetProjectRequestDetailsbyProjectRequestid();
        }
        else {
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




  selectTimeSlot(date: Date, time: string) {


    // if (this.employeeId == 0) {
    //   this.employeeId = this.serviceRequestDetails.requestModel.employeeId;
    // }

    // Check if slot is empty (no events overlapping this time slot)
    const checkStatus = this.checkSlotAvailable(date, time);
    if (checkStatus.length > 0) {
      this.scheduleMeetingModel = new ScheduleMeetingModel();
      this.scheduleMeetingModel.EmployeeId = this.employeeId;
      this.scheduleMeetingModel.ProjectID = this.projectId;
      this.scheduleMeetingModel.ServiceId = this.serviceId;
      this.scheduleMeetingModel.ScheduleDate = checkStatus[0].slotDate;
      this.scheduleMeetingModel.SlotId = checkStatus[0].id;
      this.scheduleMeetingModel.StartTime = checkStatus[0].startTime;
      this.scheduleMeetingModel.EndTime = checkStatus[0].endTime;
      this.startTime = this.formatTime(this.scheduleMeetingModel.StartTime);
      this.endTime = this.formatTime(this.scheduleMeetingModel.EndTime);




      this.showBookingForm = true;
    }
    else {
      this.closeBookingForm();
      this.scheduleMeetingModel = new ScheduleMeetingModel();
    }


    // if (this.isSlotOccupied(date, time)) {
    //   // Check if this slot is already selected
    //   const existingIndex = this.selectedSlots.findIndex(slot =>
    //     this.isSameDay(slot.date, date) && slot.time === time
    //   );

    //   if (existingIndex > -1) {
    //     // Deselect the slot
    //     this.selectedSlots.splice(existingIndex, 1);
    //   } else {
    //     // Add new slot and sort by time
    //     this.selectedSlots.push({ date, time });
    //     this.sortSelectedSlots();
    //   }

    //   // Open booking form if we have selected slots
    //   if (this.selectedSlots.length > 0) {
    //     this.showBookingForm = true;
    //     this.newBooking.duration = this.selectedSlots.length;
    //   } else {
    //     this.closeBookingForm();
    //   }
    // }
  }

  checkSlotAvailable(date: Date, time: string): any {
    // const timeMap: { [key: string]: number } = {
    //   '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
    //   '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    // };

    //const targetHour = timeMap[time];
    const timespanValue = this.convertToTimeSpanFormat(time);
    const convDate = new Date(date);

    // Get year, month, and day, ensuring proper formatting
    const year = convDate.getFullYear();
    const month = (convDate.getMonth() + 1).toString().padStart(2, '0');  // Months are zero-indexed
    const day = convDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}` + "T00:00:00";

    const _filterData = this.events.filter(x => x.status == "Available" && x.slotDate == formattedDate
      && x.startTime == timespanValue);
    return _filterData
  }


  formatTime(time: string): string {
    const [hours, minutes, seconds] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Adjust for 12-hour format

    return `${formattedHour} ${suffix}`;
  }

  convertToTimeSpanFormat(timeStr: string): string {
    const time = new Date(`1970-01-01T${this.convertTo24HourFormat(timeStr)}`);
    return time.toTimeString().split(' ')[0]; // Returns '06:00:00'
  }

  convertTo24HourFormat(timeStr: string): string {
    const [_, hourStr, meridian] = timeStr.match(/^(\d+)(am|pm)$/i) || [];
    let hour = parseInt(hourStr, 10);
    if (meridian.toLowerCase() === 'pm' && hour < 12) hour += 12;
    if (meridian.toLowerCase() === 'am' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:00:00`;
  }

  createBooking() {

    // if(this.scheduleMeetingModel.Platform == null || this.scheduleMeetingModel.Platform == "" ||
    //   this.scheduleMeetingModel.Platform == undefined
    // ) {
    //  this.toaster.displayErrorMessage('NMO', "Please Enter PlatForm");
    //  return; 
    // }

    if (this.scheduleMeetingModel.IsVirtual == null || this.scheduleMeetingModel.IsVirtual == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Select Meeting Option, Is Virtual Or Not");
      return;
    }

    if (this.scheduleMeetingModel.IsVirtual) {

      if (this.scheduleMeetingModel.Url == null || this.scheduleMeetingModel.Url == "" || this.scheduleMeetingModel.Url == undefined
      ) {
        this.toaster.displayErrorMessage('NMO', "Please Enter URL");
        return;
      }

      if (this.scheduleMeetingModel.Platform == null || this.scheduleMeetingModel.Platform == "" ||
        this.scheduleMeetingModel.Platform == undefined
      ) {
        this.toaster.displayErrorMessage('NMO', "Please Enter PlatForm");
        return;
      }

    }


    if (this.scheduleMeetingModel.ScheduleDate == null || this.scheduleMeetingModel.ScheduleDate == undefined || this.scheduleMeetingModel.ScheduleDate == ""
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Schedule Date");
      return;
    }

    // if (this.scheduleMeetingModel.ScheduleTime == null || this.scheduleMeetingModel.ScheduleTime == undefined || this.scheduleMeetingModel.ScheduleTime == ""
    // ) {
    //   this.toaster.displayErrorMessage('NMO', "Please Enter Schedule Time");
    //   return;
    // }

    // const timeParts = this.scheduleMeetingModel.ScheduleTime.split(':');
    // const hours = Number(timeParts[0]);
    // const minutes = Number(timeParts[1]);
    // const seconds = Number("00");
    // const timeSpan = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    // this.scheduleMeetingModel.ScheduleTime = timeSpan;


    // this.scheduleMeetingModel.EmployeeId = this._userInfo.employeeId
    // this.scheduleMeetingModel.ProjectID = this.projectId;

    this.showLoader = true;
    this.jobService.CreateNewMeeting(this.scheduleMeetingModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.showLoader = false;
          this.closeBookingForm();
          this.GetAllMeetingSlotsAsync();
        }
        else {
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

  ///////////////////////////////////////////////////
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
      // const eventDate = event.date;
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      // Only show event in its starting time slot for visual merging
      return this.isSameDay(eventDate, date) && targetHour === eventStartHour;
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



  isSlotSelected(date: Date, time: string): boolean {
    return this.selectedSlots.some(slot =>
      this.isSameDay(slot.date, date) && slot.time === time
    );
  }

  isMergedSlot(date: Date, time: string): boolean {
    // Check if this slot is part of a multi-hour event
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };

    const targetHour = timeMap[time];

    return this.events.some(event => {
      // const eventDate = event.date;
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      // Check if this slot is within a multi-hour event (not the starting slot)
      return this.isSameDay(eventDate, date) &&
        targetHour > eventStartHour &&
        targetHour < eventEndHour;
    });
  }

  isMergedSlotStart(date: Date, time: string): boolean {
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };

    const targetHour = timeMap[time];

    return this.events.some(event => {
      // const eventDate = event.date;
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      return this.isSameDay(eventDate, date) &&
        targetHour === eventStartHour &&
        eventEndHour > eventStartHour;
    });
  }

  isMergedSlotMiddle(date: Date, time: string): boolean {
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };

    const targetHour = timeMap[time];

    return this.events.some(event => {
      // const eventDate = event.date;
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      return this.isSameDay(eventDate, date) &&
        targetHour > eventStartHour &&
        targetHour < eventEndHour - 1;
    });
  }

  isMergedSlotEnd(date: Date, time: string): boolean {
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };

    const targetHour = timeMap[time];

    return this.events.some(event => {
      // const eventDate = event.date;
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

  isSelectedSlotStart(date: Date, time: string): any {
    if (!this.isSlotSelected(date, time)) return false;

    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };

    const reverseTimeMap: { [key: number]: string } = {
      6: '6am', 7: '7am', 8: '8am', 9: '9am', 10: '10am', 11: '11am',
      12: '12pm', 13: '1pm', 14: '2pm', 15: '3pm', 16: '4pm', 17: '5pm'
    };

    const currentHour = timeMap[time];
    const nextHour = currentHour + 1;
    const nextTimeSlot = reverseTimeMap[nextHour];

    return nextTimeSlot && this.isSlotSelected(date, nextTimeSlot);
  }

  isSelectedSlotMiddle(date: Date, time: string): any {
    if (!this.isSlotSelected(date, time)) return false;

    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };

    const reverseTimeMap: { [key: number]: string } = {
      6: '6am', 7: '7am', 8: '8am', 9: '9am', 10: '10am', 11: '11am',
      12: '12pm', 13: '1pm', 14: '2pm', 15: '3pm', 16: '4pm', 17: '5pm'
    };

    const currentHour = timeMap[time];
    const prevHour = currentHour - 1;
    const nextHour = currentHour + 1;
    const prevTimeSlot = reverseTimeMap[prevHour];
    const nextTimeSlot = reverseTimeMap[nextHour];

    return prevTimeSlot && nextTimeSlot &&
      this.isSlotSelected(date, prevTimeSlot) &&
      this.isSlotSelected(date, nextTimeSlot);
  }

  isSelectedSlotEnd(date: Date, time: string): any {
    if (!this.isSlotSelected(date, time)) return false;

    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };

    const reverseTimeMap: { [key: number]: string } = {
      6: '6am', 7: '7am', 8: '8am', 9: '9am', 10: '10am', 11: '11am',
      12: '12pm', 13: '1pm', 14: '2pm', 15: '3pm', 16: '4pm', 17: '5pm'
    };

    const currentHour = timeMap[time];
    const prevHour = currentHour - 1;
    const nextHour = currentHour + 1;
    const prevTimeSlot = reverseTimeMap[prevHour];
    const nextTimeSlot = reverseTimeMap[nextHour];

    return prevTimeSlot && this.isSlotSelected(date, prevTimeSlot) &&
      (!nextTimeSlot || !this.isSlotSelected(date, nextTimeSlot));
  }


  isSlotOccupied(date: Date, time: string): boolean {
    const timeMap: { [key: string]: number } = {
      '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
      '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
    };

    const targetHour = timeMap[time];

    return this.events.filter(x => x.status == "Available").some(event => {
      // const eventDate = event.date;
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      // Check if the target hour falls within any event's time range
      return this.isSameDay(eventDate, date) &&
        targetHour >= eventStartHour &&
        targetHour < eventEndHour;
    });
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

  // getSelectedSlotsInfo() {
  //   if (this.selectedSlots.length === 0) {
  //     console.log({ date: new Date(), timeRange: '' });
  //     return { date: new Date(), timeRange: '' };
  //   }

  //   const firstSlot = this.selectedSlots[0];
  //   const lastSlot = this.selectedSlots[this.selectedSlots.length - 1];

  //   const timeMap: { [key: string]: number } = {
  //     '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
  //     '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
  //   };

  //   const startHour = timeMap[firstSlot.time];
  //   const endHour = timeMap[lastSlot.time] + 1;

  //   return {
  //     date: firstSlot.date,
  //     timeRange: `${firstSlot.time} - ${this.formatHour(endHour)}`
  //   };
  // }

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

        if (!this.isSlotOccupied(firstSlot.date, timeSlot)) {
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

  // createBooking() {
  //   if (this.selectedSlots.length > 0 && this.newBooking.title.trim()) {
  //     const timeMap: { [key: string]: number } = {
  //       '6am': 6, '7am': 7, '8am': 8, '9am': 9, '10am': 10, '11am': 11,
  //       '12pm': 12, '1pm': 13, '2pm': 14, '3pm': 15, '4pm': 16, '5pm': 17
  //     };

  //     const firstSlot = this.selectedSlots[0];
  //     const startHour = timeMap[firstSlot.time];
  //     const endHour = startHour + this.newBooking.duration;

  //     const newEvent: any = {
  //       id: Date.now().toString(),
  //       title: this.newBooking.title,
  //       startTime: `${startHour}:00`,
  //       endTime: `${endHour}:00`,
  //       date: new Date(firstSlot.date),
  //       type: this.newBooking.type
  //     };

  //     this.events.push(newEvent);
  //     this.closeBookingForm();
  //   }
  // }

  closeBookingForm() {
    this.showBookingForm = false;
    this.selectedSlots = [];
    this.newBooking = { title: '', type: 'gray', duration: 1 };
  }
}
