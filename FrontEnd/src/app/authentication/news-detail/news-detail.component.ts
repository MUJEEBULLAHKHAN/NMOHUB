import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router'; // ✅ Add this

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent {
  _userInfo!: any;

  slug: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.slug = this.route.snapshot.paramMap.get('slug');
  }

 latestNews = [
    {
      img: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image3.png',
      title: 'Digital Wallets: Are They the Future of Payments?',
      date: 'Jan 5, 2025'
    },
    {
      img: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image3.png',
      title: 'Digital Wallets: Are They the Future of Payments?',
      date: 'Jan 5, 2025'
    },
    {
      img: 'https://nmohub.com.sa/en/wp-content/uploads/sites/2/2025/01/image3.png',
      title: 'Top 3 Fintech Tools for Small Businesses',
      date: 'Jan 5, 2025'
    }
  ];



   Logout() {
     localStorage.removeItem('userinfo');
    localStorage.removeItem('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userdetails');

    this._userInfo = undefined;

    //this.router.navigate(['auth/login']);
  }
}
