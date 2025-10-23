import { Component } from '@angular/core';
import { NMOService } from '../../../../shared/services/new.service';
import { FormBuilder } from '@angular/forms';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReportService } from '../../../../services/report.service';

@Component({
  selector: 'app-meeting-access-requests-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './meeting-access-requests-page.component.html',
  styleUrl: './meeting-access-requests-page.component.scss',
  providers: [DisplaymessageComponent]

})
export class MeetingAccessRequestsPageComponent {

  meetingRequests: any[] = [];
  showLoader = false;
  _userInfo: any;
  roles: any;

  constructor(
    private nmoService: NMOService,
    private fb: FormBuilder,
    private toastr: DisplaymessageComponent,
    private reportService: ReportService
  ) {
    this._userInfo = JSON.parse(localStorage.getItem('userdetails') as string);
    this.roles = JSON.parse(localStorage.getItem('roles') as string);
    console.log(this.roles, 'roles');
    console.log(this._userInfo, '_userInfo');
    console.log(this.roles[0]?.id, 'this.roles[0]?.id');
  }

  ngOnInit(): void {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.getMeetingAccessRequests();
  }
generateReport() {
    const statusId = 0; // You can change this or get from filter
    this.reportService.exportMeetingAccessRoomList(statusId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MeetAcc_${new Date().toISOString().replace(/[:.]/g, '_')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  ngOnDestroy() {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }
  formatTime(time: string): string {
  return time.substring(0, 5);
}

  getMeetingAccessRequests() {
    this.showLoader = true;

    let apiCall;
    if (this.roles[0]?.id == 10) {
      // Super Admin / Admin → Get all
      apiCall = this.nmoService.GetAllMeetingAccessRequest();
    } else {
      // Normal User → Get by EmployeeId
      apiCall = this.nmoService.GetAllMeetingAccessRequestByEmployeeId(this._userInfo?.employeeId);
    }

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.meetingRequests = res.body.data;
        } else {
          this.toastr.displayErrorMessage('NMO', 'Failed to load Meeting Access Requests');
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }
}
