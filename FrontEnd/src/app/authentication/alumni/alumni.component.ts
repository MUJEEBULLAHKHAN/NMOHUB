import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alumni',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './alumni.component.html',
  styleUrl: './alumni.component.scss'
})
export class AlumniComponent {
  _userInfo!: any;
    cards: any[] = [];

  constructor(private translate: TranslateService) { }

    ngOnInit() {
    this.loadPrograms();

    this.translate.onLangChange.subscribe(() => {
      this.loadPrograms();
    });

  }

  loadPrograms() {
    this.translate.get('ALUMNI.CARDS').subscribe((data: any[]) => {
      this.cards = data;
    });
  }

  Logout() {
    localStorage.removeItem('userinfo');
    localStorage.removeItem('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userdetails');

    this._userInfo = undefined;

    //this.router.navigate(['auth/login']);
  }
}
