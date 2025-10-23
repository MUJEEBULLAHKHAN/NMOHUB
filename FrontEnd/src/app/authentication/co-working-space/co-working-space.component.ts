import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PackageService } from '../../shared/services/twsbservices/package.service';
import { Package, Service, SortPackage } from '../../models/Reference';
//import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { NMOService } from '../../shared/services/new.service';
import { Router } from '@angular/router';
import { tr } from 'date-fns/locale';


@Component({
  selector: 'app-co-working-space',
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './co-working-space.component.html',
  styleUrl: './co-working-space.component.scss',
  providers: [DisplaymessageComponent],

})
export class CoWorkingSpaceComponent {
  _userInfo!: any;
  activeTab: string = 'meeting';
  translations: any = []  // <- add this
  planTypes: any = []  // <- add this
  packageList!: Package[];
  showLoader = false;
  bookingLoader = false;
  dataPackage: SortPackage[] = [];
  fullName: any;
  emailAddress: any;
  meetingRoom: any = {};
  slots: any[] = [];   // slots from API
  bookingForm!: FormGroup;
  timeSlotsByDate: any[] = [];
  meetingRoomFeatures: any

  coWorkingSpaceForm!: FormGroup;
  coWorkingSpace: any = {};
  coWorkingSpaceLoader = false;

  meetingRoomNo: any;
  startTime: any;
  endTime: any;

  closedOffice: any = [];
  closedOfficeData: any = {};
  virtualOfficeData: any = {};
  isAvailableClosedOffice: any = false;
  closedOfficeForm!: FormGroup;
  customerPackageForm!: FormGroup;
  virtualPackageForm!: FormGroup;
  closedOfficeLoader = false;
  closedOffices: any[] = [];

  // Calendar properties
  currentView: 'week' | 'month' | 'year' = 'week';
  currentDate: Date = new Date();
  currentWeekDays: Date[] = [];
  selectedSlot: any = null;
  calendarEvents: any[] = [];
  otp: any;
  isOTPSend: boolean = false;
  isOTPSendText: boolean = false;
  isClosedOfficeSelected: boolean = false;
  customerPackage: any;


  customerPackageLoader = false;

  timeSlots = [
    '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'
  ];

  @ViewChild('modalPackagePopUp') modalPackagePopUp: TemplateRef<any> | undefined;
  serviceId: any;
  packageId: any;

  constructor(private translate: TranslateService,
    public packageService: PackageService,
    private modalService: NgbModal,
    private toastr: DisplaymessageComponent,
    private jobService: NMOService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this._userInfo = JSON.parse(localStorage.getItem('userdetails') as string)

    if (this._userInfo == undefined || this._userInfo == null || this._userInfo == "") {
      this.isOTPSend = true;
    }

    this.GetAllPackage();
    this.loadTranslations();
    this.loadTranslationsOfCoWorking();

    this.translate.onLangChange.subscribe(() => {
      this.loadTranslations();
      this.loadTranslationsOfCoWorking();
    });
    this.getAllMeetingRooms();
    this.updateCalendarData();

    this.bookingForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: [''],
      meetingSlotId: ['']
    });

    this.getAllClosedOffices();

    this.closedOfficeForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: ''
    });

    this.customerPackageForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: '',
      serviceName: '',
      meetingRoomAccessRequiredHour: 0,
      coWorkingSpaceMonthly: 0,
      coWorkingSpaceRequiredSeats: 0,
      closedOfficeMonthly: 0,
      closedOfficeSizeRequest: 0,
      budgetAmount: 0,
      description: '',
    });

    this.getAllCoWorkingSpace();
    this.coWorkingSpaceForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: [''],
      quantity: ['', Validators.required],
    });

    this.virtualPackageForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: '',
      packageId: 0
    });
  }

  openCoWorkingSpaceModal(content: any) {

    if (this.coWorkingSpace.totalQuantity <= 0) {
      this.toastr.displayErrorMessage('Error', 'Unable to Book this Service, There Is No Free Space, Contact To Admin');
      return;
    }


    if (this._userInfo == undefined || this._userInfo == null || this._userInfo == "") {
      this.isOTPSend = true;
    }
    this.isOTPSendText = false;

    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'custom-modal-class' });
    this.coWorkingSpaceForm.patchValue({
      fullName: this._userInfo?.firstNames && this._userInfo?.lastName
        ? `${this._userInfo.firstNames} ${this._userInfo.lastName}`
        : '',
      emailAddress: this._userInfo?.emailAddress || '',
      mobileNumber: this._userInfo?.mobileNumber || '',
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: [''],
      quantity: 0,
    });
  }

  getAllMeetingRooms(): void {
    this.jobService.GetAllMeetingAccessRoom().subscribe({
      next: (res) => {
        const firstRoom = res.body[0];
        if (firstRoom) {
          this.meetingRoom = firstRoom;
          this.meetingRoomFeatures = this.SeparatorComma(firstRoom.features);
          console.log(this.meetingRoom, 'meetingRoom')
        }
      },
      error: (err) => {
        console.error('Error fetching rooms:', err);
      }
    });
  }
  getAllCoWorkingSpace(): void {
    this.jobService.GetAllCoWorkingSpace().subscribe({
      next: (res) => {
        const FirstcoWorkingSpace = res.body.data[0];
        if (FirstcoWorkingSpace) {
          this.coWorkingSpace = FirstcoWorkingSpace;
        }
      },
      error: (err) => {
        console.error('Error fetching rooms:', err);
      }
    });
  }

  confirmCoWorkingSpaceBooking(): void {
    if (this.coWorkingSpaceForm.invalid) {
      this.toastr.displayErrorMessage('Error', 'Please fill all fields correctly.');
      return;
    }

    if (this.coWorkingSpaceForm.value.applicantType == null || this.coWorkingSpaceForm.value.applicantType == undefined || this.coWorkingSpaceForm.value.applicantType == "") {
      this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
      return;
    }

    if (this.coWorkingSpaceForm.value.applicantType == "Individual") {
      if (this.coWorkingSpaceForm.value.nationalID == null || this.coWorkingSpaceForm.value.nationalID == undefined || this.coWorkingSpaceForm.value.nationalID == "") {
        this.toastr.displayErrorMessage('', 'Please Enter National ID')
        return;
      }
    }

    if (this.coWorkingSpaceForm.value.applicantType == "Company") {
      if (this.coWorkingSpaceForm.value.commercialRegistration == null || this.coWorkingSpaceForm.value.commercialRegistration == undefined || this.coWorkingSpaceForm.value.commercialRegistration == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
        return;
      }

      if (this.coWorkingSpaceForm.value.companyName == null || this.coWorkingSpaceForm.value.companyName == undefined || this.coWorkingSpaceForm.value.companyName == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Company Name')
        return;
      }
    }

    if (this.isOTPSendText === true) {
      if (this.coWorkingSpaceForm.value.otp == null || this.coWorkingSpaceForm.value.otp == undefined || this.coWorkingSpaceForm.value.otp == "") {
        this.toastr.displayErrorMessage('', 'Please Enter OTP')
        return;
      }
    }

    if (this.coWorkingSpaceForm.value.quantity == null || this.coWorkingSpaceForm.value.quantity == undefined || this.coWorkingSpaceForm.value.quantity == ""
      || this.coWorkingSpaceForm.value.quantity <= 0) {
      this.toastr.displayErrorMessage('', 'Please Enter Quantity')
      return;
    }


    this.coWorkingSpaceLoader = true;

    const payload = {
      coWorkingSpaceId: this.coWorkingSpace?.coWorkingSpaceId || 0,
      employeeId: this._userInfo?.employeeId || 0,
      emailAddress: this.coWorkingSpaceForm.value.emailAddress,
      fullName: this.coWorkingSpaceForm.value.fullName,
      mobileNumber: this.coWorkingSpaceForm.value.mobileNumber,
      nationalID: this.coWorkingSpaceForm.value.nationalID,
      commercialRegistration: this.coWorkingSpaceForm.value.commercialRegistration,
      companyName: this.coWorkingSpaceForm.value.companyName,
      status: 'Submit',
      quantity: this.coWorkingSpaceForm.value.quantity,
      totalPrice: (this.coWorkingSpaceForm.value.quantity * this.coWorkingSpace.price),
      Price: this.coWorkingSpace.price,
      otp: this.coWorkingSpaceForm.value.otp

      // duration: 1,
      // startDate: new Date(this.coWorkingSpaceForm.value.startDate).toISOString(),
      // endDate: new Date(this.coWorkingSpaceForm.value.endDate).toISOString(),
      // createDate: new Date().toISOString(),
      // amount: this.coWorkingSpace?.price || 0,
      // bookType: 'Online',
      // status: 'Booked',
      // emailAddress: this.coWorkingSpaceForm.value.emailAddress,
      // fullName: this.coWorkingSpaceForm.value.fullName,
      // mobileNumber: this.coWorkingSpaceForm.value.mobileNumber
    };

    this.jobService.CreateCoWorkingSpaceRequest(payload).subscribe({
      next: (res) => {
        this.coWorkingSpaceLoader = false;
        if (res.body.success) {
          this.toastr.displaySuccessMessage('NMO', 'Raised request for Co-working Space successfully!');
          this.modalService.dismissAll();
          this.coWorkingSpaceForm.reset();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body.message);
        }
      },
      error: (err) => {
        this.coWorkingSpaceLoader = false;
        this.toastr.displayErrorMessage('NMO:', err.error.message);
      }
    });
  }

  openBookingModal(content: any): void {
    this.loadSlots();
    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'custom-modal-class' });
    this.bookingForm.patchValue({
      fullName: this._userInfo?.firstNames && this._userInfo?.lastName
        ? `${this._userInfo.firstNames} ${this._userInfo.lastName}`
        : '',
      emailAddress: this._userInfo?.emailAddress || '',
      mobileNumber: this._userInfo?.mobileNumber || '',
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: ['']
    });

    if (this._userInfo == undefined || this._userInfo == null || this._userInfo == "") {
      this.isOTPSend = true;
    }
    else {
      this.isOTPSend = false;
    }
    this.isOTPSendText = false;
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

  confirmBooking(): void {

    if (this.bookingForm.invalid) {
      this.toastr.displaySuccessMessage('', 'issue in booking form')
      this.bookingLoader = false;
      return;
    }

    if (this.bookingForm.value.applicantType == null || this.bookingForm.value.applicantType == undefined || this.bookingForm.value.applicantType == "") {
      this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
      return;
    }

    if (this.bookingForm.value.applicantType == "Individual") {
      if (this.bookingForm.value.nationalID == null || this.bookingForm.value.nationalID == undefined || this.bookingForm.value.nationalID == "") {
        this.toastr.displayErrorMessage('', 'Please Enter National ID')
        return;
      }
    }

    if (this.bookingForm.value.applicantType == "Company") {
      if (this.bookingForm.value.commercialRegistration == null || this.bookingForm.value.commercialRegistration == undefined || this.bookingForm.value.commercialRegistration == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
        return;
      }

      if (this.bookingForm.value.companyName == null || this.bookingForm.value.companyName == undefined || this.bookingForm.value.companyName == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Company Name')
        return;
      }
    }

    if (this.bookingForm.value.meetingSlotId == null || this.bookingForm.value.meetingSlotId == undefined || this.bookingForm.value.meetingSlotId == "") {
      this.toastr.displayErrorMessage('', 'Please Select Slot From Calender')
      return;
    }

    if (this.isOTPSendText === true) {
      if (this.bookingForm.value.otp == null || this.bookingForm.value.otp == undefined || this.bookingForm.value.otp == "") {
        this.toastr.displayErrorMessage('', 'Please Enter OTP')
        return;
      }
    }




    this.bookingLoader = true;

    const payload = {
      meetingAccessRoomId: this.meetingRoom.meetingAccessRoomId,
      employeeId: this._userInfo?.employeeId || 0,
      meetingSlotId: this.bookingForm.value.meetingSlotId,
      createDate: new Date().toISOString(),
      amount: this.meetingRoom.price || 0,
      bookType: 'Online',
      emailAddress: this.bookingForm.value.emailAddress,
      fullName: this.bookingForm.value.fullName,
      mobileNumber: this.bookingForm.value.mobileNumber,
      nationalID: this.bookingForm.value.nationalID,
      commercialRegistration: this.bookingForm.value.commercialRegistration,
      companyName: this.bookingForm.value.companyName,
      otp: this.bookingForm.value.otp
    };

    this.jobService.CreateMeetingAccessRequest(payload).subscribe({
      next: (res) => {
        this.bookingLoader = false;
        this.isOTPSendText = true;
        if (res.body.success) {
          this.toastr.displaySuccessMessage('NMO', 'Raised request for Meeting Access successfully!');
        } else {
          this.bookingLoader = false;

          this.toastr.displayErrorMessage('NMO', 'Failed to raise request for Meeting Access');
        }
        this.modalService.dismissAll();
        this.bookingForm.reset();
        this.selectedSlot = null;

      },
      error: (err) => {
        this.bookingLoader = false;
        console.error('Error creating booking:', err.error.message)
      }
    });
  }

  getAllClosedOffices(): void {
    this.jobService.GetAllClosedOffice().subscribe({
      next: (res) => {
        if (res.body.data && res.body.data.length > 0) {
          this.closedOffice = res.body.data;
          const availableOffice = res.body.data.find((o: any) => o.status === false);
          this.isAvailableClosedOffice = !!availableOffice; // true if found, false otherwise
        } else {
          this.isAvailableClosedOffice = false;
        }
      },
      error: (err) => {
        console.error('Error fetching closed offices:', err);
      }
    });
  }

  openClosedOfficeModal(content: any): void {
    this.isOTPSend = true;
    this.isClosedOfficeSelected = false;

    this.closedOfficeForm.patchValue({
      fullName: this._userInfo?.firstNames && this._userInfo?.lastName
        ? `${this._userInfo.firstNames} ${this._userInfo.lastName}`
        : '',
      emailAddress: this._userInfo?.emailAddress || '',
      mobileNumber: this._userInfo?.mobileNumber || '',
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: ''
    });

    if (this._userInfo != undefined && this._userInfo != null && this._userInfo != "") {
      this.isClosedOfficeSelected = true;
      this.isOTPSend = true;
    }
    // else {
    //   this.isOTPSend = false;
    // }
    this.isOTPSendText = false;
    //this.isOTPSend = false;

    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'custom-modal-class' });
  }

  selectClosedOffice(closedOfficeData: any): void {
    this.closedOfficeData = closedOfficeData;
    this.isOTPSend = true;
    this.isClosedOfficeSelected = false;
  }


  confirmClosedOfficeBooking(): void {
    if (this.closedOfficeForm.invalid) {
      this.toastr.displayErrorMessage('NMO', 'Please fill all fields correctly.');
      return;
    }

    if (this.closedOfficeForm.value.applicantType == null || this.closedOfficeForm.value.applicantType == undefined || this.closedOfficeForm.value.applicantType == "") {
      this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
      return;
    }

    if (this.closedOfficeForm.value.applicantType == "Individual") {
      if (this.closedOfficeForm.value.nationalID == null || this.closedOfficeForm.value.nationalID == undefined || this.closedOfficeForm.value.nationalID == "") {
        this.toastr.displayErrorMessage('', 'Please Enter National ID')
        return;
      }
    }

    if (this.closedOfficeForm.value.applicantType == "Company") {
      if (this.closedOfficeForm.value.commercialRegistration == null || this.closedOfficeForm.value.commercialRegistration == undefined || this.closedOfficeForm.value.commercialRegistration == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
        return;
      }

      if (this.closedOfficeForm.value.companyName == null || this.closedOfficeForm.value.companyName == undefined || this.closedOfficeForm.value.companyName == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Company Name')
        return;
      }
    }

    if (this.closedOfficeData.closedOfficeId == null || this.closedOfficeData.closedOfficeId == undefined || this.closedOfficeData.closedOfficeId <= 0) {
      this.toastr.displayErrorMessage('', 'Please Select Office')
      return;
    }

    if (this.isOTPSendText === true) {
      if (this.closedOfficeForm.value.otp == null || this.closedOfficeForm.value.otp == undefined || this.closedOfficeForm.value.otp == "") {
        this.toastr.displayErrorMessage('', 'Please Enter OTP')
        return;
      }
    }

    const payload = {
      closedOfficeId: this.closedOfficeData.closedOfficeId,
      employeeId: this._userInfo?.employeeId || 0,
      amount: this.closedOfficeData.price || 0,
      emailAddress: this.closedOfficeForm.value.emailAddress,
      fullName: this.closedOfficeForm.value.fullName,
      mobileNumber: this.closedOfficeForm.value.mobileNumber,
      nationalID: this.closedOfficeForm.value.nationalID,
      commercialRegistration: this.closedOfficeForm.value.commercialRegistration,
      companyName: this.closedOfficeForm.value.companyName,
      otp: this.closedOfficeForm.value.otp
    };

    this.closedOfficeLoader = true;

    this.jobService.CreateClosedOfficeRequest(payload).subscribe({
      next: (res) => {
        this.closedOfficeLoader = false;
        if (res.body.success) {
          this.toastr.displaySuccessMessage('NMO', 'Raised request for Closed Office successfully!');
        } else {
          this.toastr.displayErrorMessage('NMO', res.body.message);
        }
        this.modalService.dismissAll();
        this.closedOfficeForm.reset();
        this.closedOffices = [];
      },
      error: (err) => {
        this.closedOfficeLoader = false;
        this.toastr.displayErrorMessage('NMO', err.error.message);
      }
    });
  }

  // Get time slots for a selected date (same logic as service-overview)
  getSlotsByDate(slots: any[]): void {
    this.timeSlotsByDate = slots;
    // Clear selected slot when date changes
    this.bookingForm.patchValue({ meetingSlotId: null });
  }

  // Select a specific time slot (same as service-overview component)
  selectScheduleTime(timeSlot: any): void {
    this.bookingForm.patchValue({
      meetingSlotId: timeSlot.meetingSlotId
    });
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
  // Optional: Add a helper method to check if a date is in the past
  private isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  // Slot Selection Methods
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

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
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

  loadTranslations() {
    this.translate.get('CO_WORKING_SPACES.ADDITIONAL_SERVICES.ITEMS').subscribe((data: any) => {
      this.translations = data;
    });
  }

  loadTranslationsOfCoWorking() {
    this.translate.get('CO_WORKING_SPACES.ADDITIONAL_SERVICES.PLAN_TYPES').subscribe((data: any) => {
      this.planTypes = data;
    });
  }


  setTab(tab: string) {
    this.activeTab = tab;
  }

  GetAllPackage() {

    this.showLoader = true;
    this.packageService.GetAllPackage().subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.packageList = x.body.data;
        this.packageList.forEach((x) => {
          x.featureList = this.SeparatorComma(x.features)
        });

      }
      else {
        this.showLoader = false;
        //this.toastr.displayErrorMessage('NMO', x.body.message);
      }

    }, (error) => {
      this.showLoader = false;
      //this.toastr.displayErrorMessage('NMO', error.message);
    });
  }

  PackagePopUp(model: any) {
    this.serviceId = model.serviceId;
    this.packageId = model.id;
    this.fullName = "";
    this.emailAddress = "";
    this.modalService.open(this.modalPackagePopUp, {
      backdrop: 'static',
      centered: true,
      size: 'md',
      windowClass: 'custom-modal-class'
    });
  }

  Submit() {

    if (this.fullName == null || this.fullName == "" || this.fullName == undefined) {
      this.toastr.displayErrorMessage('NMO', "FullName Is Mandatory");
      return;
    }

    if (this.emailAddress == null || this.emailAddress == "" || this.emailAddress == undefined) {
      this.toastr.displayErrorMessage('NMO', "Email Address Is Mandatory");
      return;
    }

    const model = {
      'FullName': this.fullName,
      'EmailAddress': this.emailAddress,
      'ServiceId': this.serviceId,
      'PackageId': this.packageId,
    }

    this.showLoader = true;
    this.jobService.CreateRequestByUser(model).subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.modalService.dismissAll();
        const packageId = x?.body?.data?.id;
        this.router.navigate(['package-info', packageId]);
      }
      else {
        this.showLoader = false;
      }

    }, (error) => {
      this.showLoader = false;
    });

  }

  SeparatorComma(description: string): string[] {
    if (description != null && description != undefined && description != "") {
      if (!description) {
        return [];
      }
      // Assuming descriptions are comma-separated
      return description.split(',').map(item => item.trim());
    }
    return [];
  }

  SendOtp(serviceType: any, closedOfficeData: any): void {

    if (serviceType == "MeetingRoomAccess") {

      if (this.bookingForm.invalid) {
        this.toastr.displayErrorMessage('', 'issue in booking form')
        this.bookingLoader = false;
        return;
      }

      if (this.bookingForm.value.applicantType == null || this.bookingForm.value.applicantType == undefined || this.bookingForm.value.applicantType == "") {
        this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
        return;
      }

      if (this.bookingForm.value.applicantType == "Individual") {
        if (this.bookingForm.value.nationalID == null || this.bookingForm.value.nationalID == undefined || this.bookingForm.value.nationalID == "") {
          this.toastr.displayErrorMessage('', 'Please Enter National ID')
          return;
        }
      }

      if (this.bookingForm.value.applicantType == "Company") {
        if (this.bookingForm.value.commercialRegistration == null || this.bookingForm.value.commercialRegistration == undefined || this.bookingForm.value.commercialRegistration == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
          return;
        }

        if (this.bookingForm.value.companyName == null || this.bookingForm.value.companyName == undefined || this.bookingForm.value.companyName == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Company Name')
          return;
        }
      }

      if (this.bookingForm.value.meetingSlotId == null || this.bookingForm.value.meetingSlotId == undefined || this.bookingForm.value.meetingSlotId == "") {
        this.toastr.displayErrorMessage('', 'Please Select Slot From Calender')
        return;
      }

      this.bookingLoader = true;
    }

    if (serviceType == "CoWorkingSpace") {

      if (this.coWorkingSpaceForm.value.applicantType == null || this.coWorkingSpaceForm.value.applicantType == undefined || this.coWorkingSpaceForm.value.applicantType == "") {
        this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
        return;
      }

      if (this.coWorkingSpaceForm.value.applicantType == "Individual") {
        if (this.coWorkingSpaceForm.value.nationalID == null || this.coWorkingSpaceForm.value.nationalID == undefined || this.coWorkingSpaceForm.value.nationalID == "") {
          this.toastr.displayErrorMessage('', 'Please Enter National ID')
          return;
        }
      }

      if (this.coWorkingSpaceForm.value.applicantType == "Company") {
        if (this.coWorkingSpaceForm.value.commercialRegistration == null || this.coWorkingSpaceForm.value.commercialRegistration == undefined || this.coWorkingSpaceForm.value.commercialRegistration == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
          return;
        }

        if (this.coWorkingSpaceForm.value.companyName == null || this.coWorkingSpaceForm.value.companyName == undefined || this.coWorkingSpaceForm.value.companyName == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Company Name')
          return;
        }
      }

      if (this.coWorkingSpaceForm.value.quantity == null || this.coWorkingSpaceForm.value.quantity == undefined || this.coWorkingSpaceForm.value.quantity == ""
        || this.coWorkingSpaceForm.value.quantity <= 0) {
        this.toastr.displayErrorMessage('', 'Please Enter Quantity')
        return;
      }

      this.coWorkingSpaceLoader = true;
    }

    if (serviceType == "ClosedOffice") {

      this.closedOfficeData = closedOfficeData;

      if (this.closedOfficeForm.invalid) {
        this.toastr.displayErrorMessage('', 'issue in booking form')
        this.closedOfficeLoader = false;
        return;
      }

      if (this.closedOfficeForm.value.applicantType == null || this.closedOfficeForm.value.applicantType == undefined || this.closedOfficeForm.value.applicantType == "") {
        this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
        return;
      }

      if (this.closedOfficeForm.value.applicantType == "Individual") {
        if (this.closedOfficeForm.value.nationalID == null || this.closedOfficeForm.value.nationalID == undefined || this.closedOfficeForm.value.nationalID == "") {
          this.toastr.displayErrorMessage('', 'Please Enter National ID')
          return;
        }
      }

      if (this.closedOfficeForm.value.applicantType == "Company") {
        if (this.closedOfficeForm.value.commercialRegistration == null || this.closedOfficeForm.value.commercialRegistration == undefined || this.closedOfficeForm.value.commercialRegistration == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
          return;
        }

        if (this.closedOfficeForm.value.companyName == null || this.closedOfficeForm.value.companyName == undefined || this.closedOfficeForm.value.companyName == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Company Name')
          return;
        }
      }

      this.closedOfficeLoader = true;

    }

    if (serviceType == "customerPackage") {

      this.closedOfficeData = closedOfficeData;

      if (this.customerPackageForm.invalid) {
        this.toastr.displayErrorMessage('', 'issue in booking form')
        this.closedOfficeLoader = false;
        return;
      }

      if (this.customerPackageForm.value.applicantType == null || this.customerPackageForm.value.applicantType == undefined || this.customerPackageForm.value.applicantType == "") {
        this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
        return;
      }

      if (this.customerPackageForm.value.applicantType == "Individual") {
        if (this.customerPackageForm.value.nationalID == null || this.customerPackageForm.value.nationalID == undefined || this.customerPackageForm.value.nationalID == "") {
          this.toastr.displayErrorMessage('', 'Please Enter National ID')
          return;
        }
      }

      if (this.customerPackageForm.value.applicantType == "Company") {
        if (this.customerPackageForm.value.commercialRegistration == null || this.customerPackageForm.value.commercialRegistration == undefined || this.customerPackageForm.value.commercialRegistration == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
          return;
        }

        if (this.customerPackageForm.value.companyName == null || this.customerPackageForm.value.companyName == undefined || this.customerPackageForm.value.companyName == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Company Name')
          return;
        }
      }

      this.customerPackageLoader = true;

    }

    if (serviceType == "VirtualOfficeData") {

      this.virtualOfficeData = closedOfficeData;

      if (this.virtualPackageForm.invalid) {
        this.toastr.displayErrorMessage('', 'issue in booking form')
        this.closedOfficeLoader = false;
        return;
      }

      if (this.virtualPackageForm.value.applicantType == null || this.virtualPackageForm.value.applicantType == undefined || this.virtualPackageForm.value.applicantType == "") {
        this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
        return;
      }

      if (this.virtualPackageForm.value.applicantType == "Individual") {
        if (this.virtualPackageForm.value.nationalID == null || this.virtualPackageForm.value.nationalID == undefined || this.virtualPackageForm.value.nationalID == "") {
          this.toastr.displayErrorMessage('', 'Please Enter National ID')
          return;
        }
      }

      if (this.virtualPackageForm.value.applicantType == "Company") {
        if (this.virtualPackageForm.value.commercialRegistration == null || this.virtualPackageForm.value.commercialRegistration == undefined || this.virtualPackageForm.value.commercialRegistration == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
          return;
        }

        if (this.virtualPackageForm.value.companyName == null || this.virtualPackageForm.value.companyName == undefined || this.virtualPackageForm.value.companyName == "") {
          this.toastr.displayErrorMessage('', 'Please Enter Company Name')
          return;
        }
      }

      this.closedOfficeLoader = true;

    }

    //this.bookingLoader = true;

    if (serviceType == "MeetingRoomAccess") {

      const payload = {
        emailAddress: this.bookingForm.value.emailAddress,
      };

      this.jobService.SendOTPForMeetingAccess(payload).subscribe({
        next: (res) => {

          this.toastr.displaySuccessMessage('', "OTP Sent")
          this.isOTPSendText = true;
          this.isOTPSend = false;
          this.bookingLoader = false;
        },
        error: (err) => {
          this.toastr.displayErrorMessage('', err.error.message)
          this.bookingLoader = false;
        }
      });
    }

    if (serviceType == "CoWorkingSpace") {
      const payload = {
        emailAddress: this.coWorkingSpaceForm.value.emailAddress,
      };
      this.jobService.SendOTPForCoWorkingSpace(payload).subscribe({
        next: (res) => {

          this.toastr.displaySuccessMessage('', "OTP Sent")
          this.isOTPSendText = true;
          this.isOTPSend = false;
          this.bookingLoader = false;
          this.coWorkingSpaceLoader = false;
        },
        error: (err) => {
          this.toastr.displayErrorMessage('', err.error.message)
          this.bookingLoader = false;
          this.coWorkingSpaceLoader = false;
        }
      });
    }

    if (serviceType == "ClosedOffice") {

      const payload = {
        emailAddress: this.closedOfficeForm.value.emailAddress,
      };

      this.jobService.SendOTPForClosedOffice(payload).subscribe({
        next: (res) => {

          this.toastr.displaySuccessMessage('', "OTP Sent")
          this.isOTPSendText = true;
          this.isOTPSend = false;
          this.isClosedOfficeSelected = false;
          this.closedOfficeLoader = false;
        },
        error: (err) => {
          this.toastr.displayErrorMessage('', err.error.message)
          this.closedOfficeLoader = false;
        }
      });
    }

    if (serviceType == "customerPackage") {

      const payload = {
        emailAddress: this.customerPackageForm.value.emailAddress,
      };

      this.jobService.SendOTPForCustomPackage(payload).subscribe({
        next: (res) => {

          this.toastr.displaySuccessMessage('', "OTP Sent")
          this.isOTPSendText = true;
          this.isOTPSend = false;
          this.customerPackageLoader = false;
        },
        error: (err) => {
          this.toastr.displayErrorMessage('', err.error.message)
          this.customerPackageLoader = false;
        }
      });
    }

    if (serviceType == "VirtualOfficeData") {

      const payload = {
        emailAddress: this.virtualPackageForm.value.emailAddress,
      };

      this.jobService.SendOTPForVirtualOffice(payload).subscribe({
        next: (res) => {

          this.toastr.displaySuccessMessage('', "OTP Sent")
          this.isOTPSendText = true;
          this.isOTPSend = false;
          this.isClosedOfficeSelected = false;
          this.closedOfficeLoader = false;
        },
        error: (err) => {
          this.toastr.displayErrorMessage('', err.error.message)
          this.closedOfficeLoader = false;
        }
      });
    }

  }


  openCustomPackageModal(content: any): void {
    this.isOTPSend = true;
    this.isClosedOfficeSelected = false;

    this.closedOfficeForm.patchValue({
      fullName: this._userInfo?.firstNames && this._userInfo?.lastName
        ? `${this._userInfo.firstNames} ${this._userInfo.lastName}`
        : '',
      emailAddress: this._userInfo?.emailAddress || '',
      mobileNumber: this._userInfo?.mobileNumber || '',
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: '',
    });

    if (this._userInfo != undefined && this._userInfo != null && this._userInfo != "") {
      this.isClosedOfficeSelected = true;
      this.isOTPSend = true;
    }
    // else {
    //   this.isOTPSend = false;
    // }
    this.isOTPSendText = false;
    //this.isOTPSend = false;

    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'custom-modal-class' });

    this.customerPackageForm.patchValue({
      fullName: this._userInfo?.firstNames && this._userInfo?.lastName
        ? `${this._userInfo.firstNames} ${this._userInfo.lastName}`
        : '',
      emailAddress: this._userInfo?.emailAddress || '',
      mobileNumber: this._userInfo?.mobileNumber || '',
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: [''],
      serviceName: '',
      meetingRoomAccessRequiredHour: 0,
      coWorkingSpaceMonthly: 0,
      coWorkingSpaceRequiredSeats: 0,
      closedOfficeMonthly: 0,
      closedOfficeSizeRequest: 0,
      budgetAmount: 0,
      description: '',
    });
  }


  confirmCustomPackage(): void {
    if (this.customerPackageForm.invalid) {
      this.toastr.displayErrorMessage('NMO', 'Please fill all fields correctly.');
      return;
    }

    if (this.customerPackageForm.value.applicantType == null || this.customerPackageForm.value.applicantType == undefined || this.customerPackageForm.value.applicantType == "") {
      this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
      return;
    }

    if (this.customerPackageForm.value.applicantType == "Individual") {
      if (this.customerPackageForm.value.nationalID == null || this.customerPackageForm.value.nationalID == undefined || this.customerPackageForm.value.nationalID == "") {
        this.toastr.displayErrorMessage('', 'Please Enter National ID')
        return;
      }
    }

    if (this.customerPackageForm.value.applicantType == "Company") {
      if (this.customerPackageForm.value.commercialRegistration == null || this.customerPackageForm.value.commercialRegistration == undefined || this.customerPackageForm.value.commercialRegistration == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
        return;
      }

      if (this.customerPackageForm.value.companyName == null || this.customerPackageForm.value.companyName == undefined || this.customerPackageForm.value.companyName == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Company Name')
        return;
      }
    }

    if (this.isOTPSendText === true) {
      if (this.customerPackageForm.value.otp == null || this.customerPackageForm.value.otp == undefined || this.customerPackageForm.value.otp == "") {
        this.toastr.displayErrorMessage('', 'Please Enter OTP')
        return;
      }

      if (this.customerPackageForm.value.otp <= 0) {
        this.toastr.displayErrorMessage('', 'Please Enter OTP')
        return;
      }

    }

    if (this.customerPackageForm.value.description == null || this.customerPackageForm.value.description == undefined || this.customerPackageForm.value.description == "") {
      this.toastr.displayErrorMessage('', 'Please Enter Description')
      return;
    }


    const payload = {
      employeeId: this._userInfo?.employeeId || 0,
      emailAddress: this.customerPackageForm.value.emailAddress,
      fullName: this.customerPackageForm.value.fullName,
      mobileNumber: this.customerPackageForm.value.mobileNumber,
      nationalID: this.customerPackageForm.value.nationalID,
      commercialRegistration: this.customerPackageForm.value.commercialRegistration,
      companyName: this.customerPackageForm.value.companyName,
      otp: this.customerPackageForm.value.otp,
      serviceName: this.customerPackageForm.value.serviceName,
      meetingRoomAccessRequiredHour: this.customerPackageForm.value.meetingRoomAccessRequiredHour,
      coWorkingSpaceMonthly: this.customerPackageForm.value.coWorkingSpaceMonthly,
      coWorkingSpaceRequiredSeats: this.customerPackageForm.value.coWorkingSpaceRequiredSeats,
      closedOfficeMonthly: this.customerPackageForm.value.closedOfficeMonthly,
      closedOfficeSizeRequest: this.customerPackageForm.value.closedOfficeSizeRequest,
      budgetAmount: this.customerPackageForm.value.budgetAmount,
      description: this.customerPackageForm.value.description,
    };

    this.customerPackageLoader = true;

    this.jobService.CreateCustomizedPackage(payload).subscribe({
      next: (res) => {
        this.customerPackageLoader = false;
        if (res.body.success) {
          this.modalService.dismissAll();
          this.customerPackageForm.reset();
          this.toastr.displaySuccessMessage('NMO', 'Raised request successfully!');
        } else {
          this.toastr.displayErrorMessage('NMO', res.body.message);
        }
      },
      error: (err) => {
        this.customerPackageLoader = false;
        this.toastr.displayErrorMessage('NMO', err.error.message);
      }
    });
  }

  openVitualOfficeModal(content: any): void {
    this.isOTPSend = true;
    this.isClosedOfficeSelected = false;

    this.virtualPackageForm.patchValue({
      fullName: this._userInfo?.firstNames && this._userInfo?.lastName
        ? `${this._userInfo.firstNames} ${this._userInfo.lastName}`
        : '',
      emailAddress: this._userInfo?.emailAddress || '',
      mobileNumber: this._userInfo?.mobileNumber || '',
      nationalID: '',
      commercialRegistration: '',
      companyName: '',
      applicantType: [''],
      otp: ''
    });

    if (this._userInfo != undefined && this._userInfo != null && this._userInfo != "") {
      this.isClosedOfficeSelected = true;
      this.isOTPSend = true;
    }
    // else {
    //   this.isOTPSend = false;
    // }
    this.isOTPSendText = false;
    //this.isOTPSend = false;

    this.modalService.open(content, { size: 'lg', centered: true, backdrop: 'static', windowClass: 'custom-modal-class' });
  }

  confirmVirtualOffice(): void {
    if (this.virtualPackageForm.invalid) {
      this.toastr.displayErrorMessage('NMO', 'Please fill all fields correctly.');
      return;
    }

    if (this.virtualPackageForm.value.applicantType == null || this.virtualPackageForm.value.applicantType == undefined || this.virtualPackageForm.value.applicantType == "") {
      this.toastr.displayErrorMessage('', 'Please Select Applicant Type')
      return;
    }

    if (this.virtualPackageForm.value.applicantType == "Individual") {
      if (this.virtualPackageForm.value.nationalID == null || this.virtualPackageForm.value.nationalID == undefined || this.virtualPackageForm.value.nationalID == "") {
        this.toastr.displayErrorMessage('', 'Please Enter National ID')
        return;
      }
    }

    if (this.virtualPackageForm.value.applicantType == "Company") {
      if (this.virtualPackageForm.value.commercialRegistration == null || this.virtualPackageForm.value.commercialRegistration == undefined || this.virtualPackageForm.value.commercialRegistration == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Commercial Registration')
        return;
      }

      if (this.virtualPackageForm.value.companyName == null || this.virtualPackageForm.value.companyName == undefined || this.virtualPackageForm.value.companyName == "") {
        this.toastr.displayErrorMessage('', 'Please Enter Company Name')
        return;
      }
    }

    if (this.virtualOfficeData.packageId == null || this.virtualOfficeData.packageId == undefined || this.virtualOfficeData.packageId <= 0) {
      this.toastr.displayErrorMessage('', 'Please Select Office')
      return;
    }

    if (this.isOTPSendText === true) {
      if (this.virtualPackageForm.value.otp == null || this.virtualPackageForm.value.otp == undefined || this.virtualPackageForm.value.otp == "") {
        this.toastr.displayErrorMessage('', 'Please Enter OTP')
        return;
      }
    }

    const payload = {
      packageId: this.virtualOfficeData.packageId,
      employeeId: this._userInfo?.employeeId || 0,
      emailAddress: this.virtualPackageForm.value.emailAddress,
      fullName: this.virtualPackageForm.value.fullName,
      mobileNumber: this.virtualPackageForm.value.mobileNumber,
      nationalID: this.virtualPackageForm.value.nationalID,
      commercialRegistration: this.virtualPackageForm.value.commercialRegistration,
      companyName: this.virtualPackageForm.value.companyName,
      otp: this.virtualPackageForm.value.otp
    };

    this.closedOfficeLoader = true;

    this.jobService.CreateVirtualRequest(payload).subscribe({
      next: (res) => {
        this.closedOfficeLoader = false;
        if (res.body.success) {
          this.toastr.displaySuccessMessage('NMO', 'Raised request for Closed Office successfully!');

          this.modalService.dismissAll();
          this.virtualPackageForm.reset();
          //this.closedOffices = [];
        } else {
          this.toastr.displayErrorMessage('NMO', res.body.message);
        }

      },
      error: (err) => {
        this.closedOfficeLoader = false;
        this.toastr.displayErrorMessage('NMO', err.error.message);
      }
    });
  }

  selectVirtualOffice(virtualOfficeData: any): void {
    this.virtualOfficeData = virtualOfficeData;
    this.isOTPSend = true;
    this.isClosedOfficeSelected = false;
  }

  Logout() {
    localStorage.removeItem('userinfo');
    localStorage.removeItem('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userdetails');

    this._userInfo = undefined;

    //this.router.navigate(['auth/login']);
  }
}
