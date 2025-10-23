import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NMOService } from '../../../shared/services/new.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-voservices',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './voservices.component.html',
  styleUrl: './voservices.component.scss'
})
export class VOServicesComponent implements OnInit {
  services: any[] = [];
  showLoader = false;
  error: string | null = null;

  constructor(private authservice: NMOService, private router: Router,private reportService: ReportService) {
        document.querySelector('.single-page-header')?.classList.add('d-none');

  }
generateReport() {
    const statusId = 0; // You can change this or get from filter
    this.reportService.exportVirtualOfficeList(statusId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VO_${new Date().toISOString().replace(/[:.]/g, '_')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  ngOnInit(): void {
    this.fetchServices();
  }

  fetchServices() {
    this.showLoader = true;
    this.authservice.GetAllServicesByAdmin().subscribe({
      next: (res: any) => {
        console.log(res,'res')
        if (res?.body?.data) {
          this.services = res.body.data;
        }
        this.showLoader = false;
      },
      error: (err) => {
        this.error = err.message;
        this.showLoader = false;
      }
    });
  }

viewDetails(id: number) {
  const url = this.router.serializeUrl(
    this.router.createUrlTree([`/package-info/${id}`])
  );
  window.open(url, '_blank'); // opens in new tab
}
}
