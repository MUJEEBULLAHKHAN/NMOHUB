import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvailabilityService } from '../expert-day-wise-available-slots/availavility.service';
import { ExpertAvailability } from '../expert-day-wise-available-slots/model';
import { ExpertService } from '../../../../shared/services/twsbservices/expert.service';
import { Expert } from '../../../../shared/services/twsbservices/expert.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { NgbAccordionConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BookingRequest, BookingResponse } from './booking';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss',
  providers: [DisplaymessageComponent],
})
export class BookingListComponent implements OnInit {
  bookingForm: FormGroup;
  experts: Expert[] = [];
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  isLoading = false;
  isLoadingBookings = false;
  errorMessage = '';
  viewMode: 'all' | 'expert' | 'customer' = 'all';
  searchTerm = '';
  statusFilter = '';
  meetingTypeFilter = '';
  userRole: string = '';
  userId: number = 0;
  isAdmin: boolean = false;
  isExpert: boolean = false;
  isCustomer: boolean = false;
  roles: any;
  userRoles: any;
  cancelationreason: any;
  reason: any;
  ratingNo: any;
  bookingId: any;
  // bookingForm: FormGroup;
  // experts: Expert[] = [];
  availabilitySlots: ExpertAvailability[] = [];
  filteredSlots: ExpertAvailability[] = [];
  // isLoading = false;
  isLoadingSlots = false;
  isSubmitting = false;
  responseMessage = '';
  isSuccess = false;
  selectedExpertId: number | null = null;
  selectedSlot: ExpertAvailability | null = null;
  availabilityId!: any
  bookedBy: number = 0; // add this property at top
  _userInfo: any;
  role!: string;
  roleId!: number;
 employeeId: any;
  expertId: any;

  @ViewChild('modalCancelBookingPopUp') modalCancelBookingPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalSessionModelPopUp') modalSessionModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalFeedBackModelPopUp') modalFeedBackModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalRescheduleModelPopUp') modalRescheduleModelPopUp: TemplateRef<any> | undefined;

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Completed', label: 'Completed' }
  ];

  meetingTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Physical', label: 'Physical' },
    { value: 'Virtual', label: 'Virtual' }
  ];



  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private expertService: ExpertService,
    private authService: AuthService, // Inject AuthService
    private modalService: NgbModal,
    private toaster: DisplaymessageComponent,
    private availabilityService: AvailabilityService,

  ) {
    this.bookingForm = this.createForm();
    //this.getUserRoleAndId();
    this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
    this.employeeId = this._userInfo.employeeId;

    var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    console.log("Role INFO IS ", roles);
    this.role = roles[0].name;
    this.roleId = roles[0].id;

  }

  ngOnInit(): void {
    this.loadExperts();
    

    this.setupFormListeners();
  }

  private setupFormListeners(): void {
    this.bookingForm.get('expertId')?.valueChanges.subscribe(expertId => {
      this.selectedExpertId = expertId;
      if (expertId) {
        this.loadAvailabilitySlots(expertId);
      } else {
        this.availabilitySlots = [];
        this.filteredSlots = [];
      }
    });

    this.bookingForm.get('meetingType')?.valueChanges.subscribe(meetingType => {
      this.filterSlotsByMeetingType(meetingType);
    });
  }

  // loadAvailabilitySlots(expertId: number): void {
  //   this.isLoadingSlots = true;
  //   this.availabilityService.getAvailableSlotsByExpertId(expertId).subscribe({
  //     next: (slots) => {
  //       this.availabilitySlots = slots;
  //       this.filteredSlots = slots;
  //       this.isLoadingSlots = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading availability slots:', error);
  //       this.isLoadingSlots = false;
  //       this.availabilitySlots = [];
  //       this.filteredSlots = [];
  //     }
  //   });
  // }
  loadAvailabilitySlots(expertId: number): void {
    this.isLoadingSlots = true;
    this.availabilityService.getAvailableSlotsByExpertId(expertId).subscribe({
      next: (slots) => {
        this.availabilitySlots = slots;
        this.filteredSlots = slots;
        this.isLoadingSlots = false;
      },
      error: (error) => {
        console.error('Error loading availability slots:', error);
        this.isLoadingSlots = false;
        this.availabilitySlots = [];
        this.filteredSlots = [];
      }
    });
  }
  onSlotSelect(slot: ExpertAvailability): void {
    this.selectedSlot = slot;
    this.availabilitySlots.forEach(s => s.isChecked = false);
    slot.isChecked = true;
  }

  formatSlotDateTime(slot: ExpertAvailability): string {
    const date = new Date(slot.availableSlotDate);
    return `${date.toLocaleDateString()} ${slot.startTime} - ${slot.endTime}`;
  }

  getSlotTypeBadge(slot: ExpertAvailability): string {
    if (slot.isPhysical && slot.isVirtual) return 'Both';
    if (slot.isPhysical) return 'Physical';
    if (slot.isVirtual) return 'Virtual';
    return 'None';
  }

  getSlotTypeClass(slot: ExpertAvailability): string {
    if (slot.isPhysical && slot.isVirtual) return 'badge bg-info';
    if (slot.isPhysical) return 'badge bg-warning text-dark';
    if (slot.isVirtual) return 'badge bg-primary';
    return 'badge bg-secondary';
  }

  filterSlotsByMeetingType(meetingType: string): void {
    if (!meetingType) {
      this.filteredSlots = this.availabilitySlots;
      return;
    }

    this.filteredSlots = this.availabilitySlots.filter(slot => {
      if (meetingType === 'Physical') {
        return slot.isPhysical;
      } else if (meetingType === 'Virtual') {
        return slot.isVirtual;
      }
      return true;
    });
  }

  // private getUserRoleAndId(): void {
  //   // Get user info from AuthService
  //   const currentUser = this.authService.getCurrentUser();

  //   if (currentUser) {
  //     this.userRole = currentUser.role;
  //     this.userId = currentUser.employeeId;

  //     // Set role flags
  //     this.isAdmin = this.userRole === 'admin';
  //     this.isExpert = this.userRole === 'expert';
  //     this.isCustomer = this.userRole === 'customer';

  //     console.log('User Role:', this.userRole);
  //     console.log('User ID:', this.userId);
  //   } else {
  //     // Fallback to localStorage if AuthService doesn't have user
  //     const userInfo = JSON.parse(localStorage.getItem('userdetails') || '{}');
  //     const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  //     this.userRole = roles[0]?.name || 'customer'; // Adjust based on your role structure
  //     this.userId = userInfo.employeeId || 0;

  //     this.isAdmin = this.userRole === 'admin';
  //     this.isExpert = this.userRole === 'expert';
  //     this.isCustomer = this.userRole === 'customer';
  //   }
  //   //this.loadAllBookings();

  //   this._userInfo = JSON.parse(localStorage.getItem('userdetails') as string);
  //   this.roles = JSON.parse(localStorage.getItem('roles') as string);
  // }

  private createForm(): FormGroup {
    return this.fb.group({
      expertId: [''],
      customerId: [''],
    });
  }

  loadExperts(): void {
    this.isLoading = true;
    this.expertService.getAllExperts().subscribe({
      next: (experts) => {
        this.experts = experts;
        this.isLoading = false;
        if (this.roleId == 9) {
            var experinfo = this.experts.filter(x => x.email === this._userInfo.emailAddress)
            if (experinfo.length > 0) {
              this.expertId = experinfo[0].expertID;
              this.loadAvailabilitySlots(this.expertId);
            }
          }
          this.loadBookingsBasedOnRole();
      },
      error: (error) => {
        console.error('Error loading experts:', error);
        this.isLoading = false;
      }
    });
  }
  // getSlotTypeBadge(slot: ExpertAvailability): string {
  //   if (slot.isPhysical && slot.isVirtual) {
  //     return 'Both';
  //   } else if (slot.isPhysical) {
  //     return 'Physical';
  //   } else if (slot.isVirtual) {
  //     return 'Virtual';
  //   }
  //   return 'None';
  // }
  onExpertChange(expertId: any): void {
    this.selectedExpertId = expertId.value;
    if (this.selectedExpertId) {
      this.loadAvailabilitySlots(this.selectedExpertId);
    } else {
      this.availabilitySlots = [];
      this.filteredSlots = [];
    }
  }

  // getSlotTypeClass(slot: ExpertAvailability): string {
  //   if (slot.isPhysical && slot.isVirtual) {
  //     return 'badge bg-info';
  //   } else if (slot.isPhysical) {
  //     return 'badge bg-warning text-dark';
  //   } else if (slot.isVirtual) {
  //     return 'badge bg-primary';
  //   }
  //   return 'badge bg-secondary';
  // }



  bookingStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' }
  ];

  paymentStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' }
  ];

  resetForm(): void {
    this.bookingForm.reset({
      bookingStatus: 'Pending',
      paymentStatus: 'Pending'
    });
    this.selectedSlot = null;
    this.availabilitySlots = [];
    this.filteredSlots = [];
  }

  // onSlotSelect(slot: ExpertAvailability): void {
  //   this.selectedSlot = slot;
  //   // slot.isChecked = true;
  //   if (slot.isChecked) {
  //     slot.isChecked = false;
  //   }
  //   else {
  //     slot.isChecked = true;
  //   }
  //   this.availabilityId = slot.id

  //   // Auto-set meeting type based on slot availability
  //   const meetingType = slot.isPhysical && slot.isVirtual ? '' :
  //     slot.isPhysical ? 'Physical' : 'Virtual';
  //   this.bookingForm.patchValue({ meetingType });

  //   // Calculate session date time
  //   const sessionDateTime = this.calculateSessionDateTime(slot);
  //   this.bookingForm.patchValue({ sessionDateTime: sessionDateTime.toISOString() });
  // }
  private calculateSessionDateTime(slot: ExpertAvailability): Date {
    const date = new Date(slot.availableSlotDate);
    const [hours, minutes] = slot.startTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // formatSlotDateTime(slot: ExpertAvailability): string {
  //   const date = new Date(slot.availableSlotDate);
  //   return `${date.toLocaleDateString()} ${slot.startTime} - ${slot.endTime}`;
  // }

  loadBookingsBasedOnRole(): void {
    this.isLoadingBookings = true;
    this.errorMessage = '';

    this.bookingService.getBookingsBasedOnRole(this.roleId, this.expertId, this._userInfo.employeeId).subscribe({

      next: (bookings) => {
        this.bookings = bookings;
        this.filteredBookings = bookings;
        this.isLoadingBookings = false;
        this.setDefaultViewMode();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoadingBookings = false;
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  private setDefaultViewMode(): void {
    // Set appropriate view mode based on user role
    if (this.isAdmin) {
      this.viewMode = 'all';
    } else if (this.isExpert) {
      this.viewMode = 'expert';
      // Pre-select the expert's ID in the form
      this.bookingForm.patchValue({ expertId: this.userId });
    } else if (this.isCustomer) {
      this.viewMode = 'customer';
      // Pre-select the customer's ID in the form
      this.bookingForm.patchValue({ customerId: this.userId });
    }
  }

  loadAllBookings(): void {
    if (!this.isAdmin) {
      this.errorMessage = 'Only administrators can view all bookings';
      return;
    }

    this.viewMode = 'all';
    this.loadBookingsBasedOnRole();
  }

  loadBookingsByExpert(): void {
    const expertId = this.bookingForm.get('expertId')?.value;
    if (expertId) {
      this.viewMode = 'expert';
      this.loadBookingsWithFilters(expertId);
    }
  }

  loadBookingsByCustomer(): void {
    const customerId = this.bookingForm.get('customerId')?.value;
    if (customerId) {
      this.viewMode = 'customer';
      this.loadBookingsWithFilters(undefined, customerId);
    }
  }

  loadBookingsWithFilters(expertId?: number, customerId?: number): void {
    this.isLoadingBookings = true;
    this.errorMessage = '';

    this.bookingService.getBookingsWithFilters(expertId, customerId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.filteredBookings = bookings;
        this.isLoadingBookings = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoadingBookings = false;
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onMeetingTypeFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredBookings = this.bookings.filter(booking => {
      const matchesSearch = this.searchTerm === '' ||
        booking.bookingId.toString().includes(this.searchTerm) ||
        booking.expertId.toString().includes(this.searchTerm) ||
        booking.bookedBy.toString().includes(this.searchTerm);

      const matchesStatus = this.statusFilter === '' ||
        booking.bookingStatus === this.statusFilter;

      const matchesMeetingType = this.meetingTypeFilter === '' ||
        booking.meetingType === this.meetingTypeFilter;

      return matchesSearch && matchesStatus && matchesMeetingType;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Confirmed':
        return 'badge bg-success';
      case 'Pending':
        return 'badge bg-warning text-dark';
      case 'Cancelled':
        return 'badge bg-danger';
      case 'Completed':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  getPaymentStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'badge bg-success';
      case 'Pending':
        return 'badge bg-warning text-dark';
      case 'Failed':
        return 'badge bg-danger';
      case 'Refunded':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  refreshBookings(): void {
    this.loadBookingsBasedOnRole();
    this.searchTerm = '';
    this.statusFilter = '';
    this.meetingTypeFilter = '';
  }

  getExpertName(expertId: number): string {
    const expert = this.experts.find(e => e.expertID === expertId);
    return expert ? expert.fullName : `Expert #${expertId}`;
  }

  getViewTitle(): string {
    switch (this.viewMode) {
      case 'all':
        return 'All Bookings';
      case 'expert':
        const expertId = this.bookingForm.get('expertId')?.value;
        return `Bookings for ${this.getExpertName(expertId)}`;
      case 'customer':
        const customerId = this.bookingForm.get('customerId')?.value;
        return `Bookings by Customer #${customerId}`;
      default:
        return 'Bookings';
    }
  }

  // Count methods
  getConfirmedCount(): number {
    return this.filteredBookings.filter(b => b.bookingStatus === 'Confirmed').length;
  }

  getPendingCount(): number {
    return this.filteredBookings.filter(b => b.bookingStatus === 'Pending').length;
  }

  getCompletedCount(): number {
    return this.filteredBookings.filter(b => b.bookingStatus === 'Completed').length;
  }

  getCancelledCount(): number {
    return this.filteredBookings.filter(b => b.bookingStatus === 'Cancelled').length;
  }

  getVirtualCount(): number {
    return this.filteredBookings.filter(b => b.meetingType === 'Virtual').length;
  }

  getPhysicalCount(): number {
    return this.filteredBookings.filter(b => b.meetingType === 'Physical').length;
  }

  // Check if user can perform certain actions
  canViewAllBookings(): boolean {
    return this.isAdmin;
  }

  canFilterByExpert(): boolean {
    return this.isAdmin || this.isExpert;
  }

  canFilterByCustomer(): boolean {
    return this.isAdmin || this.isCustomer;
  }

  // Get current user's bookings title
  getUserSpecificTitle(): string {
    if (this.isExpert) {
      return `My Bookings (Expert #${this.userId})`;
    } else if (this.isCustomer) {
      return `My Bookings (Customer #${this.userId})`;
    } else {
      return 'All Bookings';
    }
  }


  ConfirmBooking(bookingId: any): void {
    this.isLoadingBookings = true;
    this.errorMessage = '';

    this.bookingService.ConfirmBooking(bookingId).subscribe({
      next: (res) => {
        this.toaster.displaySuccessMessage('NMO', "Successfull");
        this.loadBookingsBasedOnRole();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoadingBookings = false;
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  ApproveMethodPopUp(bookingId: any) {
    this.cancelationreason = "";
    this.bookingId = bookingId;
    this.modalService.open(this.modalCancelBookingPopUp, { backdrop: 'static' });
  }

  CancelBooking(): void {
    if (this.cancelationreason == undefined || this.cancelationreason == null || this.cancelationreason == '') {
      this.toaster.displayErrorMessage('NMO', "Please Enter Cancel reason");
      return;
    }

    this.isLoadingBookings = true;
    this.errorMessage = '';

    this.bookingService.CancelByExpert(this.bookingId, this.cancelationreason).subscribe({
      next: (res) => {
        this.toaster.displaySuccessMessage('NMO', "Successfull");
        this.modalService.dismissAll();
        this.loadBookingsBasedOnRole();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoadingBookings = false;
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  CancelByUser(): void {

    if (this.cancelationreason == undefined || this.cancelationreason == null || this.cancelationreason == '') {
      this.toaster.displayErrorMessage('NMO', "Please Enter Cancel reason");
      return;
    }

    this.isLoadingBookings = true;
    this.errorMessage = '';

    this.bookingService.CancelByUser(this.bookingId, this.cancelationreason).subscribe({
      next: (res) => {
        this.toaster.displaySuccessMessage('NMO', "Successfull");
        this.modalService.dismissAll();
        this.loadBookingsBasedOnRole();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoadingBookings = false;
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  Payment(bookingId: any): void {
    this.isLoadingBookings = true;
    this.errorMessage = '';

    this.bookingService.PaymentByUser(bookingId).subscribe({
      next: (res) => {
        this.toaster.displaySuccessMessage('NMO', "Successfull");
        this.modalService.dismissAll();
        this.loadBookingsBasedOnRole();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoadingBookings = false;
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  SessionModelPopUp(bookingId: any) {
    this.reason = "";
    this.bookingId = bookingId;
    this.modalService.open(this.modalSessionModelPopUp, { backdrop: 'static' });
  }


  SessionNote(): void {
    this.isLoadingBookings = true;
    this.errorMessage = '';

    if (this.reason == undefined || this.reason == null || this.reason == '') {
      this.toaster.displayErrorMessage('NMO', "Please Enter Reason");
      return;
    }

    this.bookingService.SessionNote(this.bookingId, this.reason).subscribe({
      next: (res) => {
        this.toaster.displaySuccessMessage('NMO', "Successfull");
        this.reason = ""
        this.modalService.dismissAll();
        this.loadBookingsBasedOnRole();
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoadingBookings = false;
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  FeedBackModelPopUp(bookingId: any) {
    this.reason = "";
    this.bookingId = bookingId;
    this.modalService.open(this.modalFeedBackModelPopUp, { backdrop: 'static' });
  }


  FeedBackModel(): void {


    if (this.reason == undefined || this.reason == null || this.reason == '') {
      this.toaster.displayErrorMessage('NMO', "Please Enter Reason");
      return;
    }

    if (this.ratingNo == undefined || this.ratingNo == null || this.ratingNo == '') {
      this.toaster.displayErrorMessage('NMO', "Please Enter Rating No");
      return;
    }

    let model = {
      "BookingId": this.bookingId,
      "UserId": this._userInfo.employeeId,
      "ExpertId": this._userInfo.employeeId,
      "Rating": this.ratingNo,
      "FeedbackText": this.reason,
    }


    this.isLoadingBookings = true;
    this.errorMessage = '';
    this.bookingService.feedback(model).subscribe({
      next: (res) => {
        this.toaster.displaySuccessMessage('NMO', "Successfull");
        this.reason = ""
        this.ratingNo = 0
        this.modalService.dismissAll();
        this.loadBookingsBasedOnRole();
      },
      error: (error) => {
        console.error('Error loading bookings:', error.error);
        this.errorMessage = 'Failed to load bookings';
        this.isLoadingBookings = false;
        this.bookings = [];
        this.filteredBookings = [];
      }
    });
  }

  RescheduleModelPopUp(bookingId: any) {
    //this.bookingForm = this.createForm();

    this.bookingForm = this.fb.group({
          sessionLink: '',
          locationDetails: '',
          meetingType: '',
          expertId: ''
        });

    this.reason = "";
    this.bookingId = bookingId;
    this.modalService.open(this.modalRescheduleModelPopUp, { backdrop: 'static' });
  }


  Reshedule(): void {
    if (!this.selectedSlot) {
      this.responseMessage = 'Please select an availability slot';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.responseMessage = '';
    const formValue = this.bookingForm.value;
    const employeeId = localStorage.getItem('employeeId'); // Get employeeId from local storage

    const bookingData: BookingRequest = {
      expertId: formValue.expertId,
      bookedBy: this._userInfo?.employeeId,
      projectId: 0,
      availabilityId: this.availabilityId,
      sessionDateTime: formValue.sessionDateTime,
      meetingType: formValue.meetingType,
      bookingStatus: formValue.bookingStatus,
      paymentStatus: formValue.paymentStatus,
      paymentId: formValue.paymentId || undefined,
      sessionLink: formValue.sessionLink || undefined,
      locationDetails: formValue.locationDetails || undefined,
      cancellationReason: formValue.cancellationReason || undefined,
      rescheduleHistory: formValue.rescheduleHistory || undefined
    };

    this.bookingService.reshedule(this.bookingId, bookingData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.isSuccess = true;
        this.responseMessage = `Booking rescheduled successfully! Booking ID: }`;
        this.resetForm();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.isSuccess = false;
        this.responseMessage = 'Error creating booking. Please try again.';
        console.error('API Error:', error);

        if (error.error?.message) {
          this.responseMessage = error.error.message;
        }
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }








}