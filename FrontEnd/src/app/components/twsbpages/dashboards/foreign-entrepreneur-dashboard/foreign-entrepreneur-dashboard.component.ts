import { Component } from '@angular/core';
import { AttendanceChartData, AttendanceChartData1, ReadyForCollectionData } from '../../../../shared/data/dashboard_chartData/schoolcharts.data';
import { DashboardService } from '../../../../shared/services/twsbservices/dashboard.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { AppStateService } from '../../../../shared/services/app-state.service';
import { NMOService } from '../../../../shared/services/new.service';
import { ForeignEntrepreneurService } from '../../../../shared/services/twsbservices/ForeignEntrepreneur.service';

@Component({
  selector: 'app-foreign-entrepreneur-dashboard',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './foreign-entrepreneur-dashboard.component.html',
  styleUrl: './foreign-entrepreneur-dashboard.component.scss'
})


export class ForeignEntrepreneurDashboardComponent {
  _userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
  role!: string;
  roleId!: number;
  status!: any;
  // public chartOptions  = AttendanceChartData;
  // public chartOptions1  = AttendanceChartData1;
  // public chartOptions2  :any;
  // readyForCollectionChartData:any;
  // readyForCollectionChartStatSeries:number[]=[];
  // vehiclesCollectedChartStatSeries:number[]=[];
  // allStats:any;


  constructor(private jobService: NMOService, 
     private foreignEntrepreneurService: ForeignEntrepreneurService,
    private toaster: DisplaymessageComponent, private appStateService: AppStateService) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit() {
    var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    this.role = roles[0].name;
    this.roleId = roles[0].id;

    if (this.roleId != 10) {
      this.DashboardCountersByUser();
    }
    else {
      this.GetAllDashboardCounter();
    }

  }

  DashboardCountersByUser() {
    this.foreignEntrepreneurService.DashboardCountersForEmp(this._userInfo.employeeId).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.status = user.body.data;
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', 'Failed to load dashboard analytics');
      },
      complete: () => {
      }
    });
  }

  GetAllDashboardCounter() {
    this.foreignEntrepreneurService.DashboardCountersForAdmin().subscribe({
      next: (user) => {
        if (user.body.success) {
          this.status = user.body.data;
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', 'Failed to load dashboard analytics');
      },
      complete: () => {
      }
    });
  }

}


