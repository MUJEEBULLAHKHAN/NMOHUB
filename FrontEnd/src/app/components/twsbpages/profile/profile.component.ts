import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRM, UpdateProfile } from '../../../models/user';
import SignaturePad from 'signature_pad';
import { environment } from '../../../../environments/environment';
import { UserAuthService } from '../../../shared/services/twsbservices/user-auth.service';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-profile',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  public menuData: any[] = [];
  user = new UserRM();
  signPad: any;
  signed: any;
  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  signImage: any;
  constructor(private modalService: NgbModal,
    private userAuthService: UserAuthService,
    private toastr: DisplaymessageComponent,
  ) {

    this.user = JSON.parse(localStorage.getItem('userdetails') as string);
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  openWindowCustomClass(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }


  htmlContent1: string = ``;

  ngOnInit(): void {
    setTimeout(() => {
      this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
    }, 1000);
    this.signImage = this.user.signatureUrl;
  }

  ngOnDestroy() {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }

  allMailremove() {

  }

  startSignPadDrawing(event: Event) {
  }

  movedFinger(event: Event) {
  }

  clearSignPad() {
    this.signPad.clear();
    this.signed = false;
  }

  UpdateProfile() {
    const _request = new UpdateProfile()
    _request.employeeId = this.user.employeeId;
    if (this.signPad._data.length > 0) {
      _request.signatureData = this.signPad.toDataURL();
    }
    _request.isAvailable = this.user.isAvailable;
    this.userAuthService.UpdateProfile(_request).subscribe(x => {
      if (x.body.success == true) {
        this.toastr.displaySuccessMessage('success', "Profile Updated");
        this.user.signatureUrl = x.body.path;
        localStorage.setItem('userdetails', JSON.stringify(this.user));
        this.signImage = x.body.path;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });

  }

}
