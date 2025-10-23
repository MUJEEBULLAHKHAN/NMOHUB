import {Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgApexchartsModule} from 'ng-apexcharts';
import { SharedModule } from '../../../shared/shared.module';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatisticsChartData, StatisticsChartData1, TopCategoryChartData } from '../../../shared/data/dashboard_chartData/salechart.data';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [RouterModule,SharedModule,NgApexchartsModule,NgbModule,FlatpickrModule,FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent  {
  public chartOptions = StatisticsChartData;
  public chartOptions1 = StatisticsChartData1;
  public chartOptions2 = TopCategoryChartData;
  renderer: any;

  rangeValue: { from: Date; to: Date } = {
    from: new Date(),
    to: (new Date() as any)['fp_incr'](10)
  };

  constructor(){
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }
  
  ngOnDestroy(){
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }
}