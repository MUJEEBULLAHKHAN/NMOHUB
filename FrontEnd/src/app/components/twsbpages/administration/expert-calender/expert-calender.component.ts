import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Expert } from '../../../../shared/services/twsbservices/expert.service';
import { ExpertService } from '../../../../shared/services/twsbservices/expert.service';
import { ExpertCalendarSlot } from './expert-calendar';
import { ExpertCalendarService } from './expert-calendar.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-expert-calender',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './expert-calender.component.html',
  styleUrl: './expert-calender.component.scss'
})
export class ExpertCalenderComponent implements OnInit {
  calendarForm: FormGroup;
  experts: Expert[] = [];
  calendarSlots: ExpertCalendarSlot[] = [];
  filteredSlots: ExpertCalendarSlot[] = [];
  isLoading = false;
  isLoadingCalendar = false;
  errorMessage = '';
  selectedExpertId: number | null = null;
  selectedDate: string = '';
  statusFilter = '';
  typeFilter = '';

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Available', label: 'Available' },
    { value: 'Booked', label: 'Booked' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'physical', label: 'Physical Only' },
    { value: 'virtual', label: 'Virtual Only' },
    { value: 'both', label: 'Both Types' }
  ];

  constructor(
    private fb: FormBuilder,
    private calendarService: ExpertCalendarService,
    private expertService: ExpertService
  ) {
    this.calendarForm = this.fb.group({
      expertId: ['']
    });
  }

  ngOnInit(): void {
    this.loadExperts();
    this.setupFormListeners();
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
        this.errorMessage = 'Failed to load experts';
        this.isLoading = false;
      }
    });
  }

  setupFormListeners(): void {
    this.calendarForm.get('expertId')?.valueChanges.subscribe(expertId => {
      this.selectedExpertId = expertId;
      if (expertId) {
        this.loadExpertCalendar(expertId);
      } else {
        this.calendarSlots = [];
        this.filteredSlots = [];
      }
    });
  }

  loadExpertCalendar(expertId: number): void {
    this.isLoadingCalendar = true;
    this.errorMessage = '';

    this.calendarService.getExpertCalendar(expertId).subscribe({
      next: (slots) => {
        this.calendarSlots = slots;
        this.filteredSlots = slots;
        this.isLoadingCalendar = false;
      },
      error: (error) => {
        console.error('Error loading expert calendar:', error);
        this.errorMessage = 'Failed to load calendar data';
        this.isLoadingCalendar = false;
        this.calendarSlots = [];
        this.filteredSlots = [];
      }
    });
  }

  onDateFilter(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onTypeFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredSlots = this.calendarSlots.filter(slot => {
      // Date filter
      const matchesDate = this.selectedDate === '' ||
        new Date(slot.availableSlotDate).toDateString() === new Date(this.selectedDate).toDateString();

      // Status filter
      const matchesStatus = this.statusFilter === '' || slot.status === this.statusFilter;

      // Type filter
      let matchesType = true;
      switch (this.typeFilter) {
        case 'physical':
          matchesType = slot.isPhysical && !slot.isVirtual;
          break;
        case 'virtual':
          matchesType = !slot.isPhysical && slot.isVirtual;
          break;
        case 'both':
          matchesType = slot.isPhysical && slot.isVirtual;
          break;
      }

      return matchesDate && matchesStatus && matchesType;
    });
  }

  // formatTimeSpan(timeSpan: any): string {
  //   if (!timeSpan) return 'N/A';

  //   // Convert TimeSpan to readable time format
  //   const hours = timeSpan.hours?.toString().padStart(2, '00') || '00';
  //   const minutes = timeSpan.minutes?.toString().padStart(2, '00') || '00'; 
  //   return `${hours}:${minutes}`;
  // }
  formatTimeSpan(timeSpan: any): string {
  if (!timeSpan) return 'N/A';

  // Try different approaches to extract time
  let hours = 0;
  let minutes = 0;

  // Approach 1: If timeSpan has hours and minutes properties
  if (timeSpan.hours !== undefined && timeSpan.minutes !== undefined) {
    hours = timeSpan.hours;
    minutes = timeSpan.minutes;
  }
  // Approach 2: If timeSpan has total hours/minutes
  else if (timeSpan.totalHours !== undefined) {
    const totalHours = timeSpan.totalHours;
    hours = Math.floor(totalHours);
    minutes = Math.round((totalHours - hours) * 60);
  }
  // Approach 3: If timeSpan has total minutes
  else if (timeSpan.totalMinutes !== undefined) {
    const totalMinutes = timeSpan.totalMinutes;
    hours = Math.floor(totalMinutes / 60);
    minutes = Math.round(totalMinutes % 60);
  }
  // Approach 4: If timeSpan has ticks (common in .NET TimeSpan)
  else if (timeSpan.ticks !== undefined) {
    // .NET ticks are 100-nanosecond intervals, 1 tick = 100 nanoseconds
    // 1 second = 10,000,000 ticks
    const totalSeconds = timeSpan.ticks / 10000000;
    hours = Math.floor(totalSeconds / 3600);
    minutes = Math.floor((totalSeconds % 3600) / 60);
  }
  // Approach 5: If it's already a string or number
  else if (typeof timeSpan === 'string') {
    // Try to parse as ISO duration or time string
    const timeMatch = timeSpan.match(/(\d{2}):(\d{2})/);
    if (timeMatch) {
      hours = parseInt(timeMatch[1], 10);
      minutes = parseInt(timeMatch[2], 10);
    }
  }

  // Format the time
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}`;
}

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString();
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

  getTypeBadge(slot: ExpertCalendarSlot): string {
    if (slot.isPhysical && slot.isVirtual) {
      return 'Both';
    } else if (slot.isPhysical) {
      return 'Physical';
    } else if (slot.isVirtual) {
      return 'Virtual';
    }
    return 'None';
  }

  getTypeClass(slot: ExpertCalendarSlot): string {
    if (slot.isPhysical && slot.isVirtual) {
      return 'badge bg-info';
    } else if (slot.isPhysical) {
      return 'badge bg-warning text-dark';
    } else if (slot.isVirtual) {
      return 'badge bg-primary';
    }
    return 'badge bg-secondary';
  }

  refreshCalendar(): void {
    if (this.selectedExpertId) {
      this.loadExpertCalendar(this.selectedExpertId);
    }
    this.selectedDate = '';
    this.statusFilter = '';
    this.typeFilter = '';
  }

  groupSlotsByDate(): { date: string, slots: ExpertCalendarSlot[] }[] {
    const grouped: { [key: string]: ExpertCalendarSlot[] } = {};

    this.filteredSlots.forEach(slot => {
      const dateKey = new Date(slot.availableSlotDate).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });

    return Object.keys(grouped).map(date => ({
      date,
      slots: grouped[date].sort((a, b) => {
        const timeA = this.formatTimeSpan(a.startTime);
        const timeB = this.formatTimeSpan(b.startTime);
        return timeA.localeCompare(timeB);
      })
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getExpertName(): string {
    if (!this.selectedExpertId) return 'Select an expert';
    const expert = this.experts.find(e => e.expertID === this.selectedExpertId);
    return expert ? expert.fullName : `Expert #${this.selectedExpertId}`;
  }
  // Add these methods to your component class

  getAvailableSlotsCount(): number {
    return this.filteredSlots.filter(s => s.status === 'Available').length;
  }

  getBookedSlotsCount(): number {
    return this.filteredSlots.filter(s => s.status === 'Booked').length;
  }

  getPhysicalSlotsCount(): number {
    return this.filteredSlots.filter(s => s.isPhysical).length;
  }

  getVirtualSlotsCount(): number {
    return this.filteredSlots.filter(s => s.isVirtual).length;
  }

  getBothTypesSlotsCount(): number {
    return this.filteredSlots.filter(s => s.isPhysical && s.isVirtual).length;
  }

  getTotalSlotsCount(): number {
    return this.filteredSlots.length;
  }
}