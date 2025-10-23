import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Expert, ExpertService } from '../../shared/services/twsbservices/expert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-expert-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './expert-view.component.html',
  styleUrl: './expert-view.component.scss'
})
export class ExpertViewComponent implements OnInit {
  expert?: any;
  loading = false;
  error = '';
  rejectReason = '';
  rejectError = '';
  rejectLoading = false;
  acceptLoading = false;

  API = environment.APIUrl
  constructor(private route: ActivatedRoute, private expertService: ExpertService) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;
    if (!isNaN(id)) {
      this.fetchExpert(id);
    } else {
      this.error = 'Invalid expert id';
    }
  }

  fetchExpert(id: number): void {
    this.loading = true;
    this.expertService.getExpertProfile(id).subscribe({
      next: (res) => {
        this.expert = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load expert';
        this.loading = false;
        console.error(err);
      }
    });
  }

  rejectExpert() {
    // Use browser's prompt for rejection reason
    const reason = prompt('Please provide a reason for rejecting this expert:');
    
    if (reason === null) {
      // User clicked cancel
      return;
    }
    
    if (!reason.trim()) {
      this.rejectError = 'Please enter a reason for rejection.';
      return;
    }
    
    if (!this.expert || typeof this.expert.expertID !== 'number') {
      this.rejectError = 'Expert ID is missing.';
      return;
    }
    
    this.rejectLoading = true;
    this.expertService.rejectExpert(this.expert.expertID, reason).subscribe({
      next: () => {
        if (this.expert) {
          this.expert.status = 'Rejected';
        }
        this.rejectLoading = false;
        this.rejectError = '';
        alert('Expert rejected successfully!');
      },
      error: err => {
        this.rejectError = 'Failed to reject expert. Try again.';
        this.rejectLoading = false;
        console.error(err);
      }
    });
  }

  acceptExpert() {
    if (!this.expert || typeof this.expert.expertID !== 'number') {
      this.acceptLoading = false;
      return;
    }
    
    // Optional: Add confirmation for accept action
    if (!confirm('Are you sure you want to accept this expert?')) {
      return;
    }
    
    this.acceptLoading = true;
    this.expertService.activateExpert(this.expert.expertID).subscribe({
      next: () => {
        if (this.expert) {
          this.expert.status = 'Active';
        }
        this.acceptLoading = false;
        alert('Expert accepted successfully!');
      },
      error: err => {
        this.acceptLoading = false;
        alert('Failed to accept expert. Please try again.');
        console.error(err);
      }
    });
  }
}