
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvailabilityService } from './availavility.service';
import { ExpertAvailability } from './model';
import { CommonModule } from '@angular/common';
import { ExpertService } from '../../../../shared/services/twsbservices/expert.service';
import { Expert } from '../../../../shared/services/twsbservices/expert.service';

// import { Expert } from '../../../../authentication/expert/view-all-experts/expert.model';

@Component({
  selector: 'app-expert-day-wise-available-slots',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './expert-day-wise-available-slots.component.html',
  styleUrl: './expert-day-wise-available-slots.component.scss'
})
export class ExpertDayWiseAvailableSlotsComponent implements OnInit {
  availabilityForm: FormGroup;
  experts: Expert[] = [];
  isLoading = false;
  isSubmitting = false;
  responseMessage = '';
  isSuccess = false;
  generatedSlots: ExpertAvailability[] = [];
  today: Date = new Date(); // Add this property

  constructor(
    private fb: FormBuilder,
    private availabilityService: AvailabilityService,
    private expertService: ExpertService
  ) {
    this.availabilityForm = this.createForm();
  }

  ngOnInit(): void {
    //this.loadExperts();
this.fetchExpertIdFromUserId();
  }
  fetchExpertIdFromUserId(): void {
  this.expertService.getExpertIdByLoggedInUser().subscribe(
    (result: { success: boolean; expertId?: number; message?: string }) => {
      if (result.success && result.expertId) {
        this.availabilityForm.patchValue({ expertId: result.expertId });
        this.availabilityForm.get('expertId')?.disable();
      } else {
        this.responseMessage = result.message || 'Unable to fetch expert information.';
      }
    },
    (error) => {
      console.error('Error fetching expertId:', error);
      this.responseMessage = 'Unable to fetch expert information.';
    }
  );
}

  private createForm(): FormGroup {
    return this.fb.group({
      expertId: ['', [Validators.required, Validators.min(1)]],
      slotDate: ['', Validators.required],
      isPhysical: [false],
      isVirtual: [false],
      timeSlots: this.fb.array([this.createTimeSlot()])
    });
  }

  private createTimeSlot(): FormGroup {
    return this.fb.group({
      startTime: ['09:00', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]]
    });
  }

  get timeSlots(): FormArray {
    return this.availabilityForm.get('timeSlots') as FormArray;
  }

  addTimeSlot(): void {
    this.timeSlots.push(this.createTimeSlot());
  }

  removeTimeSlot(index: number): void {
    if (this.timeSlots.length > 1) {
      this.timeSlots.removeAt(index);
    }
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

  onSubmit(): void {
    if (this.availabilityForm.invalid) {
      this.markFormGroupTouched(this.availabilityForm);
      return;
    }

    const formValue = this.availabilityForm.getRawValue();

    if (!formValue.isPhysical && !formValue.isVirtual) {
      this.responseMessage = 'Please select at least one availability type (Physical or Virtual)';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.responseMessage = '';

    const request = [{
      expertId: formValue.expertId,
      slotDate: this.formatDate(formValue.slotDate),
      createdDate: this.formatDate(new Date()),
      isPhysical: formValue.isPhysical,
      isVirtual: formValue.isVirtual,
      timeSlots: formValue.timeSlots.map((slot: any) => ({
        startTime: slot.startTime + ':00'
      }))
    }];

    this.availabilityService.generateDayWiseSlots(request).subscribe({
      next: (response: ExpertAvailability[]) => {
        this.isSubmitting = false;
        this.isSuccess = true;
        this.responseMessage = 'Slots generated successfully!';
        this.generatedSlots = response;
      },
      error: (error) => {
        this.isSubmitting = false;
        this.isSuccess = false;
        this.responseMessage = 'Error generating slots. Please try again.';
        console.error('API Error:', error);

        if (error.error?.message) {
          this.responseMessage = error.error.message;
        }
      }
    });
  }

  // Changed from private to public
  public formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    this.availabilityForm.reset({
      isPhysical: false,
      isVirtual: false
    });
    this.timeSlots.clear();
    this.addTimeSlot();
    this.responseMessage = '';
    this.generatedSlots = [];
  }

  getExpertName(expertId: number): string {
    const expert = this.experts.find(e => e.expertID === expertId);
    return expert ? expert.fullName : `Expert #${expertId}`;
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }
}