import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Expert, ExpertService } from '../../shared/services/twsbservices/expert.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-expert-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbModule],
  templateUrl: './expert-list.component.html',
  styleUrl: './expert-list.component.scss'
})
export class ExpertListComponent implements OnInit {
  experts: Expert[] = [];
  filteredExperts: Expert[] = [];
  loading = false;
  error: string = '';
  searchTerm: string = '';

  API = environment.APIUrl

  constructor(private expertService: ExpertService) {}

  ngOnInit(): void {
    this.fetchExperts();
  }

  fetchExperts(): void {
    this.loading = true;
    this.error = '';
    this.expertService.getAllExperts().subscribe({
      next: (res) => {
        this.experts = res || [];
        this.filteredExperts = [...this.experts];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load experts';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredExperts = [...this.experts];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredExperts = this.experts.filter(expert =>
      expert.fullName?.toLowerCase().includes(term) ||
      expert.email?.toLowerCase().includes(term) ||
      expert.nationality?.toLowerCase().includes(term) ||
      expert.idType?.toLowerCase().includes(term)
    );
  }

  sortBy(field: string): void {
    this.filteredExperts.sort((a, b) => {
      switch (field) {
        case 'name':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'experience':
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        case 'createdAt':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        default:
          return 0;
      }
    });
  }
}



