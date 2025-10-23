import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
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
