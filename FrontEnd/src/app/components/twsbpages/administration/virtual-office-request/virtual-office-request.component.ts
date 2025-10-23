import { Component } from '@angular/core';
import { NMOService } from '../../../../shared/services/new.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Event } from '../../../../models/new-service';

@Component({
  selector: 'app-virtual-office-request',
  standalone: true,
  // imports: [CommonModule, DatePipe, RouterModule],
  imports: [NgIf, NgFor, TranslateModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './virtual-office-request.component.html',
  styleUrl: './virtual-office-request.component.scss',
  providers: [DisplaymessageComponent]

})
export class VirtualOfficeComponent {

  coWorkingSpaceRequests: any[] = [];
  showLoader = false;
  coWorkingSpaceLoader = false;
  bookingLoader = false;
  _userInfo: any;
  roles: any;
  virtualRequest: any;
  virtualSpaceLoader = false;
  slots: any[] = [];   // slots from API
  calendarEvents: any[] = [];
  bookingForm!: FormGroup;
  selectedSlot: any = null;
  meetingRoomNo: any;
  startTime: any;
  endTime: any;
  currentWeekDays: Date[] = [];
  currentView: 'week' | 'month' | 'year' = 'week';
  currentDate: Date = new Date();
  packageModel: any = {};
  events: Event[] = [];
  filteredSlots: any[] = [];

  timeSlots = [
    '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'
  ];


  constructor(
    private fb: FormBuilder,
    private toastr: DisplaymessageComponent,
    private modalService: NgbModal,
    private jobService: NMOService,

  ) {
    this._userInfo = JSON.parse(localStorage.getItem('userdetails') as string);
    this.roles = JSON.parse(localStorage.getItem('roles') as string);
    console.log(this.roles, 'roles');
    console.log(this._userInfo, '_userInfo');
    console.log(this.roles[0]?.id, 'this.roles[0]?.id');
    this.updateCalendarData();
  }


  ngOnInit(): void {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.GetPackageRequestRequest();
    this.bookingForm = this.fb.group({

    });
  }

  ngOnDestroy() {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }

  GetPackageRequestRequest() {
    this.showLoader = true;

    let apiCall;
    if (this.roles[0]?.id == 10) {
      // Super Admin / Admin → Get all
      apiCall = this.jobService.GetAllPackageRequestRequest();
    } else {
      // Normal User → Get by EmployeeId
      apiCall = this.jobService.GetAllPackageRequestRequestByEmployeeId(this._userInfo?.employeeId);
    }

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.virtualRequest = res.body.data;
        } else {
          this.toastr.displayErrorMessage('NMO', 'Failed to load Meeting Access Requests');
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }

  ApprovePackageRequestRequest(coWorkingSpaceRequestId: any) {
    this.showLoader = true;

    let apiCall;

    apiCall = this.jobService.ApprovePackageRequestRequest(coWorkingSpaceRequestId);

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.GetPackageRequestRequest();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body?.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }

  RejectPackageRequestRequest(coWorkingSpaceRequestId: any) {
    this.showLoader = true;

    let apiCall;

    apiCall = this.jobService.RejectPackageRequestRequest(coWorkingSpaceRequestId);

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.GetPackageRequestRequest();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body?.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }

  loadSlots(): void {
    this.jobService.GetAllMeetingSlots().subscribe({
      next: (res) => {
        if (res.body.success) {
          const allSlots = res.body.data || [];

          // Filter slots to show only today and future slots
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

          this.slots = allSlots.filter((slot: any) => {
            // Parse the ISO date string: "2025-08-03T00:00:00"
            const slotDate = new Date(slot.slotDate);
            return slotDate >= today; // Only include today and future dates
          });

          this.calendarEvents = this.slots.map(slot => ({
            ...slot,
            date: slot.slotDate,
            type: slot.status === 'Available' ? 'green' : 'gray'
          }));
        } else {
          this.toastr.displayErrorMessage('NMO', res.body.message);
        }
      },
      error: (err) => console.error('Error fetching slots:', err)
    });
  }

  isSlotSelected(date: Date, time: string): boolean {
    if (!this.selectedSlot) return false;

    const slotDate = new Date(this.selectedSlot.slotDate);
    const slotStartHour = parseInt(this.selectedSlot.startTime.split(':')[0]);

    const timeMap: { [key: string]: number } = {
      '6 AM': 6, '7 AM': 7, '8 AM': 8, '9 AM': 9, '10 AM': 10, '11 AM': 11,
      '12 PM': 12, '1 PM': 13, '2 PM': 14, '3 PM': 15, '4 PM': 16, '5 PM': 17,
      '6 PM': 18, '7 PM': 19, '8 PM': 20, '9 PM': 21, '10 PM': 22
    };

    const targetHour = timeMap[time];

    return this.isSameDay(slotDate, date) && targetHour === slotStartHour;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  formatTimeSlot(time: string): string {
    // time is like "11:00:00"
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Force leading zeros (07, 08, etc.)
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute}`;
  }

  selectTimeSlot(date: Date, time: string, event: any): void {
    // Don't allow selection of past dates
    if (this.isPastDate(date)) {
      this.toastr.displayWarningMessage('NMO', 'Your not able to book past date slots')
      return;
    }
    const availableSlot = this.checkSlotAvailable(date, time);
    if (availableSlot.length > 0) {
      this.selectedSlot = availableSlot[0];
      this.bookingForm.patchValue({
        meetingSlotId: event.meetingSlotId
      });
      this.bookingForm.value.meetingSlotId = event.meetingSlotId;
    } else {
      this.selectedSlot = null;
      this.bookingForm.patchValue({
        meetingSlotId: null
      });
    }
    this.startTime = this.formatTime(this.selectedSlot.startTime);
    this.endTime = this.formatTime(this.selectedSlot.endTime);

    if (event.isMeetingRoomOne) {
      this.meetingRoomNo = "Room 1";
    }
    if (event.isMeetingRoomTwo) {
      this.meetingRoomNo = "Room 2";
    }
  }

  formatTime(time: string): string {
    const [hours, minutes, seconds] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12; // Adjust for 12-hour format

    return `${formattedHour} ${suffix}`;
  }

  isSlotOccupied(date: Date, time: string): boolean {
    const timeMap: { [key: string]: number } = {
      '6 AM': 6, '7 AM': 7, '8 AM': 8, '9 AM': 9, '10 AM': 10, '11 AM': 11,
      '12 PM': 12, '1 PM': 13, '2 PM': 14, '3 PM': 15, '4 PM': 16, '5 PM': 17,
      '6 PM': 18, '7 PM': 19, '8 PM': 20, '9 PM': 21, '10 PM': 22
    };

    const targetHour = timeMap[time];

    return this.calendarEvents.filter(x => x.status === "Available").some(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);
      const eventEndHour = parseInt(event.endTime.split(':')[0]);

      return this.isSameDay(eventDate, date) &&
        targetHour >= eventStartHour &&
        targetHour < eventEndHour;
    });
  }

  checkSlotAvailable(date: Date, time: string): any[] {
    const timespanValue = this.convertToTimeSpanFormat(time);
    const convDate = new Date(date);

    // Check if the selected date is today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    convDate.setHours(0, 0, 0, 0);

    if (convDate < today) {
      return []; // Don't allow selection of past dates
    }

    const year = convDate.getFullYear();
    const month = (convDate.getMonth() + 1).toString().padStart(2, '0');
    const day = convDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}T00:00:00`;

    return this.calendarEvents.filter(x =>
      x.status === "Available" &&
      x.slotDate === formattedDate &&
      x.startTime === timespanValue
    );
  }


  convertToTimeSpanFormat(timeStr: string): string {
    const time = new Date(`1970-01-01T${this.convertTo24HourFormat(timeStr)}`);
    return time.toTimeString().split(' ')[0];
  }

  convertTo24HourFormat(timeStr: string): string {
    const match = timeStr.match(/^(\d+)\s+(AM|PM)$/i);
    if (!match) {
      return '00:00:00';
    }
    const [_, hourStr, meridian] = match;
    let hour = parseInt(hourStr, 10);
    if (meridian.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (meridian.toUpperCase() === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:00:00`;
  }

  getEventsForDayAndTime(date: Date, timeSlot: string): any[] {
    const timeMap: { [key: string]: number } = {
      '6 AM': 6, '7 AM': 7, '8 AM': 8, '9 AM': 9, '10 AM': 10, '11 AM': 11,
      '12 PM': 12, '1 PM': 13, '2 PM': 14, '3 PM': 15, '4 PM': 16, '5 PM': 17,
      '6 PM': 18, '7 PM': 19, '8 PM': 20, '9 PM': 21, '10 PM': 22
    };

    const targetHour = timeMap[timeSlot];

    return this.calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      const eventStartHour = parseInt(event.startTime.split(':')[0]);

      return this.isSameDay(eventDate, date) && targetHour === eventStartHour;
    });
  }

  private isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  formatDayHeader(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    return `${dayName} ${date.getDate()} / ${monthName} `;
  }

  getDateRangeDisplay(): string {
    const start = this.currentWeekDays[0];
    const end = this.currentWeekDays[6];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }


  // Calendar Navigation Methods
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
    if (this.currentView === 'week') {
      this.generateWeekDays();
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

  // Add method to check if navigation back should be disabled
  shouldDisableBackNavigation(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the start of current displayed week
    const startOfWeek = new Date(this.currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Disable if going back would show a week that ends before today
    const endOfPreviousWeek = new Date(startOfWeek);
    endOfPreviousWeek.setDate(endOfPreviousWeek.getDate() - 1);

    return endOfPreviousWeek < today;
  }

  openBookingModal(packageModel: any, content: any): void {
    this.packageModel = packageModel;
    this.loadSlots();
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'custom-modal-class' });
  }

  confirmBooking(): void {

    if (this.bookingForm.invalid) {
      this.toastr.displaySuccessMessage('', 'issue in booking form')
      this.bookingLoader = false;
      return;
    }

    if (this.bookingForm.value.meetingSlotId == null || this.bookingForm.value.meetingSlotId == undefined || this.bookingForm.value.meetingSlotId == "") {
      this.toastr.displayErrorMessage('', 'Please Select Slot From Calender')
      return;
    }

    if (this.packageModel.packageRequestId == null || this.packageModel.packageRequestId == undefined || this.packageModel.packageRequestId == ""
      || this.packageModel.packageRequestId <= 0
    ) {
      this.toastr.displayErrorMessage('', 'Package Request Id Is Meesing')
      return;
    }

    this.bookingLoader = true;

    const payload = {
      employeeId: this._userInfo?.employeeId || 0,
      meetingSlotId: this.bookingForm.value.meetingSlotId,
      packageRequestId: this.packageModel.packageRequestId
    };

    this.jobService.PackageMeetingAccessRequest(payload).subscribe({
      next: (res) => {
        this.bookingLoader = false;
        if (res.body.success) {
          this.toastr.displaySuccessMessage('NMO', 'Raised request for Meeting Access successfully!');
        } else {
          this.bookingLoader = false;

          this.toastr.displayErrorMessage('NMO', 'Failed to raise request for Meeting Access');
        }
        this.modalService.dismissAll();
        this.bookingForm.reset();
        this.selectedSlot = null;
        this.GetPackageRequestRequest();
      },
      error: (err) => {
        this.bookingLoader = false;
        console.error('Error creating booking:', err.error.message)
      }
    });
  }

  openMeetingScheduleModal(packageModel: any, content: any): void {
    this.packageModel = packageModel;
    this.GetAllMeetingSlotsAsync();
    this.loadSlots();
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'custom-modal-class' });
  }

  GetAllMeetingSlotsAsync() {
    this.virtualSpaceLoader = true;
    this.jobService.GetAllPackageMeetingSlots(this.packageModel.employeeId).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.filteredSlots = user.body.data;
        } else {
          this.toastr.displayErrorMessage('NMO', user.body.message);
          this.virtualSpaceLoader = false;
        }
      },
      error: (error) => {
        this.toastr.displayErrorMessage('NMO', error.error.message);
        this.virtualSpaceLoader = false;
      },
      complete: () => {
        this.virtualSpaceLoader = false;
      }
    });
  }
}
