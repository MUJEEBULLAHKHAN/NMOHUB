import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarService } from './calendar.service';
import { ExpertService } from '../../../../shared/services/twsbservices/expert.service';
import { CalendarEvent } from './calendar';
import { Expert } from '../../../../shared/services/twsbservices/expert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  calendarForm: FormGroup;
  experts: Expert[] = [];
  calendarEvents: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];
  isLoading = false;
  isLoadingCalendar = false;
  errorMessage = '';
  selectedExpertId: number | null = null;
  selectedView: 'day' | 'week' | 'month' = 'week';
  selectedDate: Date = new Date();
  eventTypeFilter = '';

  eventTypeOptions = [
    { value: '', label: 'All Events' },
    { value: 'Availability', label: 'Available Slots' },
    { value: 'Booking', label: 'Bookings' },
    { value: 'Blocked', label: 'Blocked Time' }
  ];

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService,
    private expertService: ExpertService
  ) {
    this.calendarForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadExperts();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      expertId: [''],
      viewType: ['week'],
      eventType: ['']
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

  onExpertChange(): void {
    const expertId = this.calendarForm.get('expertId')?.value;
    this.selectedExpertId = expertId;

    if (expertId) {
      this.loadCalendarEvents(expertId);
    } else {
      this.calendarEvents = [];
      this.filteredEvents = [];
    }
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onViewChange(): void {
    this.selectedView = this.calendarForm.get('viewType')?.value;
  }

  onDateChange(direction: 'prev' | 'next' | 'today'): void {
    const newDate = new Date(this.selectedDate);

    switch (direction) {
      case 'prev':
        if (this.selectedView === 'day') {
          newDate.setDate(newDate.getDate() - 1);
        } else if (this.selectedView === 'week') {
          newDate.setDate(newDate.getDate() - 7);
        } else {
          newDate.setMonth(newDate.getMonth() - 1);
        }
        break;
      case 'next':
        if (this.selectedView === 'day') {
          newDate.setDate(newDate.getDate() + 1);
        } else if (this.selectedView === 'week') {
          newDate.setDate(newDate.getDate() + 7);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        break;
      case 'today':
        newDate.setTime(Date.now());
        break;
    }

    this.selectedDate = newDate;
    if (this.selectedExpertId) {
      this.loadCalendarEvents(this.selectedExpertId);
    }
  }

  loadCalendarEvents(expertId: number): void {
    this.isLoadingCalendar = true;
    this.errorMessage = '';

    this.calendarService.getExpertCalendar(expertId).subscribe({
      next: (events) => {
        this.calendarEvents = events;
        this.applyFilters();
        this.isLoadingCalendar = false;
      },
      error: (error) => {
        console.error('Error loading calendar events:', error);
        this.errorMessage = 'Failed to load calendar events';
        this.isLoadingCalendar = false;
        this.calendarEvents = [];
        this.filteredEvents = [];
      }
    });
  }

  applyFilters(): void {
    this.filteredEvents = this.calendarEvents.filter(event => {
      const matchesType = this.eventTypeFilter === '' || event.eventType === this.eventTypeFilter;
      return matchesType;
    });
  }

  getEventTypeBadgeClass(eventType: string): string {
    switch (eventType) {
      case 'Availability':
        return 'badge bg-success';
      case 'Booking':
        return 'badge bg-primary';
      case 'Blocked':
        return 'badge bg-secondary';
      default:
        return 'badge bg-info';
    }
  }

  getBookingStatusBadgeClass(status: string): string {
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

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  }

  formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getDuration(start: string, end: string): string {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMins = Math.round(durationMs / (1000 * 60));

    if (durationMins < 60) {
      return `${durationMins} mins`;
    } else {
      const hours = Math.floor(durationMins / 60);
      const mins = durationMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  }

  refreshCalendar(): void {
    if (this.selectedExpertId) {
      this.loadCalendarEvents(this.selectedExpertId);
    }
  }

  getExpertName(expertId: number): string {
    const expert = this.experts.find(e => e.expertID === expertId);
    return expert ? expert.fullName : `Expert #${expertId}`;
  }

  getViewTitle(): string {
    if (!this.selectedExpertId) return 'Expert Calendar';

    return `${this.getExpertName(this.selectedExpertId)}'s Calendar`;
  }

  getDateRangeTitle(): string {
    if (this.selectedView === 'day') {
      return this.selectedDate.toLocaleDateString();
    } else if (this.selectedView === 'week') {
      const startOfWeek = new Date(this.selectedDate);
      startOfWeek.setDate(this.selectedDate.getDate() - this.selectedDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
    } else {
      return this.selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' });
    }
  }

  groupEventsByDate(): { [key: string]: CalendarEvent[] } {
    const grouped: { [key: string]: CalendarEvent[] } = {};

    this.filteredEvents.forEach(event => {
      const dateKey = new Date(event.startDateTime).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });

    return grouped;
  }

  getSortedDateKeys(groupedEvents: { [key: string]: CalendarEvent[] }): string[] {
    return Object.keys(groupedEvents).sort((a, b) =>
      new Date(a).getTime() - new Date(b).getTime()
    );
  }
  // Add these methods to your component class

  getTotalEventsCount(): number {
    return this.filteredEvents.length;
  }

  getAvailabilityEventsCount(): number {
    return this.filteredEvents.filter(event => event.eventType === 'Availability').length;
  }

  getBookingEventsCount(): number {
    return this.filteredEvents.filter(event => event.eventType === 'Booking').length;
  }

  getBlockedEventsCount(): number {
    return this.filteredEvents.filter(event => event.eventType === 'Blocked').length;
  }

  getConfirmedBookingsCount(): number {
    return this.filteredEvents.filter(event =>
      event.eventType === 'Booking' && event.bookingStatus === 'Confirmed'
    ).length;
  }

  getVirtualMeetingsCount(): number {
    return this.filteredEvents.filter(event =>
      event.eventType === 'Booking' && event.meetingType === 'Virtual'
    ).length;
  }
}
