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
import { ExpertListComponent } from '../expert/expert-list.component';
// import { ExpertListComponent } from '../expert-list/expert-list.component';

@Component({
  selector: 'app-expert-features',
  standalone: true,
  providers: [DisplaymessageComponent],
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, NgbModule, RouterModule, ExpertListComponent],
  templateUrl: './expert-features.component.html',
  styleUrl: './expert-features.component.scss'
})
export class ExpertFeaturesComponent {
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
