import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ✅ Import this
import { RouterModule } from '@angular/router'; // ✅ Add this
import { Newsletter } from '../../models/newsletterModel';
import { NewsletterService } from '../../shared/services/twsbservices/newsletter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-news',
  standalone: true,
  providers: [DisplaymessageComponent],
  imports: [CommonModule, RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {


  newsletters: Newsletter[] = [];
  newsletterModel: Newsletter = new Newsletter();
  showLoader = false;
  _userInfo!: any;
  safeHtml: SafeHtml | undefined;

  constructor(
    private newsletterService: NewsletterService,
    private modalService: NgbModal,
    private toastr: DisplaymessageComponent,
    private sanitizer: DomSanitizer
  ) { }

  featuredNews = [
    {
      image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image16.png',
      title: 'Signing of a Collaboration Agreement with the Korean Business Accelerator NWVP_LLC',
      categories: 'Company, Relationships',
      date: 'January 3, 2025',
      slug: 'signing-collaboration-korean-nwvp'
    },
    {
      image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image3.png',
      title: 'Behind Every Number Lies a Success Story!',
      categories: 'Company',
      date: 'January 5, 2025',
      slug: 'behind-every-number-success-story'
    },
  ];

  otherNews = [
    {
      image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image13.png',
      title: 'Closing a funding round for Digital Guide Company',
      categories: 'Events',
      date: 'January 4, 2025',
      slug: 'funding-round-digital-guide-company'
    },
    {
      image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image13.png',
      title: 'Closing a Funding Round for Al-Morshid Al-Raqami',
      categories: 'Events',
      date: 'January 2, 2025',
      slug: 'funding-round-al-morshid-al-raqami'
    },
    {
      image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image13.png',
      title: 'Participation of NmoHub Incubator and Accelerator in Biban 24 Forum',
      categories: 'Company, Events',
      date: 'January 12, 2025',
      slug: 'nomo-hub-biban24-forum'
    },
    {
      image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image13.png',
      title: 'NmoHub Announces Its Achievements for 2023',
      categories: 'Company',
      date: 'January 20, 2025',
      slug: 'nomo-hub-achievements-2023'
    }
    // {
    //   image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image13.png',
    //   title: 'Closing a funding round for Digital Guide Company',
    //   categories: 'Events',
    //   date: 'January 4, 2025'
    // },
    // {
    //   image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image13.png',
    //   title: 'Closing a Funding Round for Al-Morshid Al-Raqami',
    //   categories: 'Events',
    //   date: 'January 2, 2025'
    // },
    // {
    //   image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image13.png',
    //   title: 'Participation of NmoHub Incubator and Accelerator in Biban 24 Forum',
    //   categories: 'Company, Events',
    //   date: 'January 12, 2025'
    // },
    // {
    //   image: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image13.png',
    //   title: 'NmoHub Announces Its Achievements for 2023',
    //   categories: 'Company',
    //   date: 'January 20, 2025'
    // }
  ];

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.showLoader = true;
    this.newsletterService.getAll().subscribe({
      next: (res) => {
        this.showLoader = false;
        this.newsletters = res;
      },
      error: (err) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('Error', err.message);
      }
    });
  }

  htmlData(data: any) {
    return this.sanitizer.bypassSecurityTrustHtml(data);

  }

  Logout() {
    localStorage.removeItem('userinfo');
    localStorage.removeItem('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userdetails');

    this._userInfo = undefined;

    //this.router.navigate(['auth/login']);
  }
}
