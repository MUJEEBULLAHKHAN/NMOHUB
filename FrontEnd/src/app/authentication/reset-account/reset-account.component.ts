import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { UserAuthService } from '../../shared/services/twsbservices/user-auth.service';

@Component({
  selector: 'app-reset-account',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule,NgbModule,CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './reset-account.component.html',
  styleUrl: './reset-account.component.scss'
})
export class ResetAccountComponent {

  public showPassword: boolean = false;
  public showPassword1: boolean = false;
  public showPassword2: boolean = false;
  toggleClass = 'ri-eye-off-line';
  toggleClass1 = 'ri-eye-off-line';
  toggleClass2 = 'ri-eye-off-line';
  showLoader:boolean=false;

  constructor(private toastr:DisplaymessageComponent,private router:Router,private authservice:UserAuthService,private route: ActivatedRoute)
  {

  }

  submitPasswords(password:any,confirmPassword:any)
  {
    if (this.validateForm(password, confirmPassword)) {
      this.showLoader = true;
      var request = {
        "EmailAddress": this.route.snapshot.queryParams['email'],
        "Token": this.route.snapshot.queryParams['t'],
        "Password": password
      }
      this.authservice.ResetPassword(request).subscribe({
        next: (user) => 
        {
          if(user.body.success)
          {
            this.toastr.displaySuccessMessage('NMO',user.body.message);
            this.router.navigate(['auth/login']);
          }
          else
          {
            this.toastr.displayErrorMessage('NMO',user.body.message);
            this.showLoader = false;
          }
        },     
        error: (error) =>
        {
          this.toastr.displayErrorMessage('NMO','An Error Occured. Failed to Reset Password');
          this.showLoader = false;
        },
        complete: () => {
          this.showLoader = false;
        } 
      });
     }
     else
     {
      this.toastr.displayErrorMessage('NMO','Passwords do not match');
     }
  }

  validateForm(password: string, confirmPassword: string) {
  
    if (password.length === 0) {
      return false;
    }
 
    if (confirmPassword.length === 0) {
      return false;
    }
 
    if (password != confirmPassword) {
      return false;
    }

    if(this.route.snapshot.queryParams['t'] == undefined || this.route.snapshot.queryParams['t'] == null)
    {
      return false;
    }
 
    return true;
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
}
