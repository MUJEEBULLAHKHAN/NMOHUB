import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule, CommonModule,TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  _userInfo!: any;


   Logout() {
     localStorage.removeItem('userinfo');
    localStorage.removeItem('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userdetails');

    this._userInfo = undefined;

    //this.router.navigate(['auth/login']);
  }
}
