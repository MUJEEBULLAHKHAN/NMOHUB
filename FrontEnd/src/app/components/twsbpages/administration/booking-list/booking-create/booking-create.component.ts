import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../booking.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { ExpertService } from '../../../../../shared/services/twsbservices/expert.service';
import { Expert } from '../../../../../shared/services/twsbservices/expert.service';
import { AvailabilityService } from '../../expert-day-wise-available-slots/availavility.service';
import { ExpertAvailability } from '../../expert-day-wise-available-slots/model';
import { CommonModule } from '@angular/common';
import { BookingRequest, BookingResponse } from '../booking';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-booking-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './booking-create.component.html',
  styleUrl: './booking-create.component.scss'
})
export class BookingCreateComponent implements OnInit {
  bookingForm: FormGroup;
  projectId!: number;
  experts: Expert[] = [];
  availabilitySlots: ExpertAvailability[] = [];
  filteredSlots: ExpertAvailability[] = [];
  isLoading = false;
  isLoadingSlots = false;
  isSubmitting = false;
  responseMessage = '';
  isSuccess = false;
  selectedExpertId: number | null = null;
  selectedSlot: ExpertAvailability | null = null;
  availabilityId!: any
  bookedBy: number = 0; // add this property at top
  userRoles: any;
  _userInfo: any;
  roles: any; 


  meetingTypeOptions = [
    { value: 'Physical', label: 'Physical Meeting' },
    { value: 'Virtual', label: 'Virtual Meeting' }
  ];

  bookingStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Confirmed', label: 'Confirmed' }
  ];

  paymentStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' }
  ];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private availabilityService: AvailabilityService,
    private expertService: ExpertService,
     private route: ActivatedRoute,
    private authService: AuthService // 👈 make sure this has user info
  ) {
    this.bookingForm = this.createForm();
    
    // Replace with actual user info retrieval from AuthService
    this._userInfo = JSON.parse(localStorage.getItem('userdetails') as string);
    this.roles = JSON.parse(localStorage.getItem('roles') as string);
    console.log(this.roles, 'roles');
    console.log(this._userInfo, '_userInfo');
    console.log(this.roles[0]?.id, 'this.roles[0]?.id');

  }

  ngOnInit(): void {
    this.loadExperts();
    this.setupFormListeners();
    const idParam = this.route.snapshot.queryParamMap.get('id');
    this.projectId = Number(idParam);
  }

  private createForm(): FormGroup {
    return this.fb.group({
      expertId: ['', [Validators.required, Validators.min(1)]],
      // bookedBy: ['', [Validators.required, Validators.min(1)]],

      // availabilityId: ['', [Validators.required, Validators.min(1)]],
      meetingType: ['', [Validators.required]],
      bookingStatus: ['Pending', [Validators.required]],
      paymentStatus: ['Pending', [Validators.required]],
      paymentId: [''],
      sessionLink: [''],
      locationDetails: [''],
      cancellationReason: [''],
      rescheduleHistory: ['']
    });
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

  loadExperts(): void {
    this.isLoading = true;
    this.expertService.getAllExperts().subscribe({
      next: (experts) => {
        this.experts = experts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading experts:', error);
        this.isLoading = false;
      }
    });
  }

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

  onSlotSelect(slot: ExpertAvailability): void {
    this.selectedSlot = slot;
    // slot.isChecked = true;
    if (slot.isChecked) {
      slot.isChecked = false;
    }
    else {
      slot.isChecked = true;
    }
    this.availabilityId = slot.availabilityId

    // Auto-set meeting type based on slot availability
    const meetingType = slot.isPhysical && slot.isVirtual ? '' :
      slot.isPhysical ? 'Physical' : 'Virtual';
    this.bookingForm.patchValue({ meetingType });

    // Calculate session date time
    const sessionDateTime = this.calculateSessionDateTime(slot);
    this.bookingForm.patchValue({ sessionDateTime: sessionDateTime.toISOString() });
  }

  private calculateSessionDateTime(slot: ExpertAvailability): Date {
    const date = new Date(slot.availableSlotDate);
    const [hours, minutes] = slot.startTime.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  onSubmit(): void {
    // if (this.bookingForm.invalid) {
    //   this.markFormGroupTouched(this.bookingForm);
    //   return;
    // }

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
      projectId: this.projectId,
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

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.isSuccess = true;
        this.responseMessage = `Booking created successfully! Booking ID: ${response.bookingId}`;
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

  resetForm(): void {
    this.bookingForm.reset({
      bookingStatus: 'Pending',
      paymentStatus: 'Pending'
    });
    this.selectedSlot = null;
    this.availabilitySlots = [];
    this.filteredSlots = [];
  }

  getExpertName(expertId: number): string {
    const expert = this.experts.find(e => e.expertID === expertId);
    return expert ? expert.fullName : `Expert #${expertId}`;
  }

  formatSlotDateTime(slot: ExpertAvailability): string {
    const date = new Date(slot.availableSlotDate);
    return `${date.toLocaleDateString()} ${slot.startTime} - ${slot.endTime}`;
  }

  getSlotTypeBadge(slot: ExpertAvailability): string {
    if (slot.isPhysical && slot.isVirtual) {
      return 'Both';
    } else if (slot.isPhysical) {
      return 'Physical';
    } else if (slot.isVirtual) {
      return 'Virtual';
    }
    return 'None';
  }

  getSlotTypeClass(slot: ExpertAvailability): string {
    if (slot.isPhysical && slot.isVirtual) {
      return 'badge bg-info';
    } else if (slot.isPhysical) {
      return 'badge bg-warning text-dark';
    } else if (slot.isVirtual) {
      return 'badge bg-primary';
    }
    return 'badge bg-secondary';
  }
}