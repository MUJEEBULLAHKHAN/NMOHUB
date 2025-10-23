import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  _userInfo!: any;

  activeIndex: number | null = null;
  faqs: any[] = [];

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.loadPrograms();

    this.translate.onLangChange.subscribe(() => {
      this.loadPrograms();
    });

  }

  loadPrograms() {
    this.translate.get('FAQ.FAQ_SECTION.QUESTIONS').subscribe((data: any[]) => {
      this.faqs = data;
    });
  }

  toggleAnswer(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  Logout() {
    localStorage.removeItem('userinfo');
    localStorage.removeItem('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userdetails');
    this._userInfo = undefined;
  }
}
