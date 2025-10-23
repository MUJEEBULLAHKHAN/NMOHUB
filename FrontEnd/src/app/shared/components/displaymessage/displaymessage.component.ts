import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-displaymessage',
  standalone: false,
  //imports: [],
  templateUrl: './displaymessage.component.html',
  styleUrl: './displaymessage.component.scss'
})
export class DisplaymessageComponent {
  constructor(private toast:ToastrService)
  {
  }

  displayErrorMessage(messageHeader:any,messageText:any)
  {
    this.toast.error(messageText,messageHeader, {
      timeOut: 15000,
      positionClass: 'toast-top-right',
    });
  }

  displaySuccessMessageWithTimeout(messageHeader:any,messageText:any,timeout:number)
  {
    this.toast.success(messageText,messageHeader, {
      timeOut: timeout,
      positionClass: 'toast-top-right',
    });
  }

  displaySuccessMessage(messageHeader:any,messageText:any)
  {
    this.toast.success(messageText,messageHeader, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
  }

  displayWarningMessage(messageHeader:any,messageText:any)
  {
    this.toast.warning(messageText,messageHeader, {
      timeOut: 3000,
      positionClass: 'toast-top-right',
    });
  }
}
