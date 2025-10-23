import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvailabilityService } from '../expert-day-wise-available-slots/availavility.service';
import { ExpertAvailability } from '../expert-day-wise-available-slots/model';
import { ExpertService } from '../../../../shared/services/twsbservices/expert.service';
import { Expert } from '../../../../shared/services/twsbservices/expert.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-expert-availability-list',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './expert-availability-list.component.html',
  styleUrl: './expert-availability-list.component.scss'
})
export class ExpertAvailabilityListComponent implements OnInit {
  availabilityForm: FormGroup;
  experts: Expert[] = [];
  availabilitySlots: ExpertAvailability[] = [];
  filteredSlots: ExpertAvailability[] = [];
  isLoading = false;
  isLoadingSlots = false;
  errorMessage = '';
  selectedExpertId: number | null = null;
  searchDate = '';
  statusFilter = '';
  _userInfo: any;
  role!: string;
  roleId!: number;
  employeeId: any;
  expertId: any;

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Available', label: 'Available' },
    { value: 'Booked', label: 'Booked' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  constructor(
    private fb: FormBuilder,
    private availabilityService: AvailabilityService,
    private expertService: ExpertService
  ) {
    this.availabilityForm = this.fb.group({
      expertId: ['']
    });

    this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
    this.employeeId = this._userInfo.employeeId;

    var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    console.log("Role INFO IS ", roles);
    this.role = roles[0].name;
    this.roleId = roles[0].id;

  }

  ngOnInit(): void {
    this.loadExperts();
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
      },
      error: (error) => {
        console.error('Error loading experts:', error);
        this.errorMessage = 'Failed to load experts';
        this.isLoading = false;
      }
    });
  }

  onExpertChange(): void {
    const expertId = this.availabilityForm.get('expertId')?.value;
    this.selectedExpertId = expertId;

    if (expertId) {
      this.loadAvailabilitySlots(expertId);
    } else {
      this.availabilitySlots = [];
      this.filteredSlots = [];
    }
  }

  loadAvailabilitySlots(expertId: number): void {
    this.isLoadingSlots = true;
    this.errorMessage = '';

    this.availabilityService.getAvailabilitySlotsByExpertId(expertId).subscribe({
      next: (slots) => {
        this.selectedExpertId = expertId;
        this.availabilitySlots = slots;
        this.filteredSlots = slots;
        this.isLoadingSlots = false;
      },
      error: (error) => {
        console.error('Error loading availability slots:', error);
        this.errorMessage = 'Failed to load availability slots';
        this.isLoadingSlots = false;
        this.availabilitySlots = [];
        this.filteredSlots = [];
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredSlots = this.availabilitySlots.filter(slot => {
      const matchesDate = this.searchDate === '' ||
        slot.availableSlotDate.includes(this.searchDate);

      const matchesStatus = this.statusFilter === '' || slot.status === this.statusFilter;

      return matchesDate && matchesStatus;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'badge bg-success';
      case 'Booked':
        return 'badge bg-primary';
      case 'Cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getAvailabilityTypeBadge(slot: ExpertAvailability): string {
    if (slot.isPhysical && slot.isVirtual) {
      return 'Both';
    } else if (slot.isPhysical) {
      return 'Physical';
    } else if (slot.isVirtual) {
      return 'Virtual';
    }
    return 'None';
  }

  getAvailabilityTypeClass(slot: ExpertAvailability): string {
    if (slot.isPhysical && slot.isVirtual) {
      return 'badge bg-info';
    } else if (slot.isPhysical) {
      return 'badge bg-warning text-dark';
    } else if (slot.isVirtual) {
      return 'badge bg-primary';
    }
    return 'badge bg-secondary';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(timeString: string): string {
    return timeString.substring(0, 5); // Remove seconds
  }

  refreshSlots(): void {
    if (this.selectedExpertId) {
      this.loadAvailabilitySlots(this.selectedExpertId);
    }
    this.searchDate = '';
    this.statusFilter = '';
  }

  getExpertName(expertId: number): string {
    const expert = this.experts.find(e => e.expertID === expertId);
    return expert ? expert.fullName : `Expert #${expertId}`;
  }
  // Add these methods to your component class
  getTotalSlotsCount(): number {
    return this.filteredSlots.length;
  }

  getAvailableSlotsCount(): number {
    return this.filteredSlots.filter(s => s.status === 'Available').length;
  }

  getBookedSlotsCount(): number {
    return this.filteredSlots.filter(s => s.status === 'Booked').length;
  }

  getCancelledSlotsCount(): number {
    return this.filteredSlots.filter(s => s.status === 'Cancelled').length;
  }

  getBothTypesSlotsCount(): number {
    return this.filteredSlots.filter(s => s.isPhysical && s.isVirtual).length;
  }

  getPhysicalSlotsCount(): number {
    return this.filteredSlots.filter(s => s.isPhysical && !s.isVirtual).length;
  }

  getVirtualSlotsCount(): number {
    return this.filteredSlots.filter(s => !s.isPhysical && s.isVirtual).length;
  }
}