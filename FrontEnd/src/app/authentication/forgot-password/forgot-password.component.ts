import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../shared/models/authentication';
import { ToastrService } from 'ngx-toastr';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { UserAuthService } from '../../shared/services/twsbservices/user-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule,NgbModule,CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  public showPassword: boolean = false;
  public showPassword1: boolean = false;
  public showPassword2: boolean = false;
  toggleClass = 'ri-eye-off-line';
  toggleClass1 = 'ri-eye-off-line';
  toggleClass2 = 'ri-eye-off-line';
  showLoader:boolean=false;
  authentication = new authentication();

  constructor(private toastr: DisplaymessageComponent,private userAuth:UserAuthService)
  {
    
  }

  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }
  public togglePassword1() {
    this.showPassword1 = !this.showPassword1;
    if (this.toggleClass1 === 'ri-eye-line') {
      this.toggleClass1 = 'ri-eye-off-line';
    } else {
      this.toggleClass1 = 'ri-eye-line';
    }
  }
  public togglePassword2() {
    this.showPassword2 = !this.showPassword2;
    if (this.toggleClass2 === 'ri-eye-line') {
      this.toggleClass2 = 'ri-eye-off-line';
    } else {
      this.toggleClass2 = 'ri-eye-line';
    } 
  }



  sendEmail() {
    if(this.authentication.emailAddress == null || this.authentication.emailAddress == "" || this.authentication.emailAddress == undefined) {
      this.toastr.displayErrorMessage('Error', "Please Enter a valid Email Address");
      return;
    }

    this.showLoader = true;
    var request = {
      "EmailAddress" : this.authentication.emailAddress
    }
    
    this.userAuth.ForgotPassword(request).subscribe({
      next: (user) => 
      {
        this.toastr.displaySuccessMessage('NMO', user.body.message);
      },     
      error: (error) =>
      {
        this.toastr.displayErrorMessage('Error', error.body);
      },
      complete: () => {
        this.showLoader = false;
      } 
  });
  }
}
