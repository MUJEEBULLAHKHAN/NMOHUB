import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ExpertService } from './expert.service';
import { Expert, ApiResponse } from './view-all-expert';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-all-experts',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './view-all-experts.component.html',
  styleUrl: './view-all-experts.component.scss'
})
export class ViewAllExpertsComponent implements OnInit {
  editExpert(_t56: Expert) {
    throw new Error('Method not implemented.');
  }
  viewExpert(_t56: Expert) {
    throw new Error('Method not implemented.');
  }
  experts: Expert[] = [];
  filteredExperts: Expert[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  statusFilter = '';

  // Status options for filter
  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  constructor(private expertService: ExpertService) { }

  ngOnInit(): void {
    this.loadExperts();
  }

  loadExperts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.expertService.getAllExperts().subscribe({
      next: (data: Expert[]) => {
        this.experts = data;
        this.filteredExperts = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load experts. Please try again.';
        this.isLoading = false;
        console.error('Error loading experts:', error);
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
    this.filteredExperts = this.experts.filter(expert => {
      const matchesSearch = this.searchTerm === '' ||
        expert.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        expert.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        expert.phoneNumber.includes(this.searchTerm);

      const matchesStatus = this.statusFilter === '' || expert.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'badge bg-success';
      case 'Inactive':
        return 'badge bg-secondary';
      case 'Pending':
        return 'badge bg-warning text-dark';
      case 'Rejected':
        return 'badge bg-danger';
      default:
        return 'badge bg-info';
    }
  }

  getProfilePictureUrl(profilePicture: string): string {
    if (!profilePicture) {
      return 'assets/images/default-profile.png';
    }

    if (profilePicture.startsWith('http')) {
      return profilePicture;
    }

    // Assuming the API returns relative paths, construct full URL
    return environment.APIUrl + `${profilePicture}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  refreshExperts(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.loadExperts();
  }
}