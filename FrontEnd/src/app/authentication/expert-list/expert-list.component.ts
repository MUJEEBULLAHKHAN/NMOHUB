import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { ExpertService } from '../../authentication/expert/view-all-experts/expert.service';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { Expert } from '../expert/view-all-experts/view-all-expert';

@Component({
  selector: 'app-expert-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, NgbModule, RouterModule],
  providers: [DisplaymessageComponent],
  templateUrl: './expert-list.component.html',
  styleUrl: './expert-list.component.scss'
})
export class ExpertListComponent {
  experts: Expert[] = [];
  activeIndex: number | null = null;

  constructor(private expertService: ExpertService, private translate: TranslateService) { }

  ngOnInit() {
    this.loadExperts();

    // Reload experts if language changes (optional)
    this.translate.onLangChange.subscribe(() => {
      this.loadExperts();
    });
  }

  loadExperts() {
    this.expertService.getAllExperts().subscribe({
      next: (data) => {
        this.experts = data;
      },
      error: (err) => {
        console.error('Error fetching experts:', err);
      }
    });
  }

  toggleExpert(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
