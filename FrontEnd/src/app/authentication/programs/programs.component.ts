import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss'
})
export class ProgramsComponent {
  _userInfo!: any;

  activeIndex: number | null = null;
  programs: any[] = [];
  accelerationBenefits: any[] = [];

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.loadPrograms();
    this.loadProgramsAcceleration();

    // Optional: reload when language changes
    this.translate.onLangChange.subscribe(() => {
      this.loadPrograms();
      this.loadProgramsAcceleration();
    });
   
  }

  loadPrograms() {
    this.translate.get('PROGRAMS.INCUBATION_SECTION.BENEFITS').subscribe((data: any[]) => {
      this.programs = data;
    });
  }
  loadProgramsAcceleration() {
   this.translate.get('PROGRAMS.ACCELERATION_SECTION.BENEFITS').subscribe((data: any[]) => {
      this.accelerationBenefits = data;
    });
  }


  // programs = [
  //   { title: 'Build a sustainable startup', description: 'Master the right methodology to establish an agile, effective business model.' },
  //   { title: 'Grasp core entrepreneurial concepts', description: 'Understand the fundamental principles of entrepreneurship and apply them to your project.' },
  //   { title: 'Expand your network', description: 'Learn how to develop strong connections that support your venture’s growth.' },
  //   { title: 'Align expertise with your product', description: 'Bridge the gap between your experience and market demands through your entrepreneurial product.' },
  //   { title: 'Design and implement a business model', description: 'Navigate the journey from design to successful execution of your business model.' },
  //   { title: 'Form a startup team', description: 'Understand essential aspects of entrepreneurship and team formation.' },
  //   { title: 'Business modeling & market strategy', description: 'Learn how to structure your business and develop effective go-to-market strategies and entrepreneurial marketing.' },
  //   { title: 'Finance fundamentals for entrepreneurs', description: 'Get acquainted with financial and accounting basics that support informed business decisions.' }
  // ];
  // acceleration = [
  //   { title: 'Mentoring', description: 'Access experienced consultants and coaches across management, finance, tech, legal, and marketing to support strategic decisions.' },
  //   { title: 'Funding', description: 'Assistance in preparing investment profiles, business plans, and financial models; training in pitching, fundraising, and scaling.' },
  //   { title: 'Workshops & Training', description: 'Specialized courses covering digital marketing, finance, operations, team management, and more to build entrepreneurial skills.' },
  //   { title: 'Legal & Administrative Support', description: 'Help with company registration, intellectual property, contracts, taxes, and regulatory advice.' },
  //   { title: 'Networking', description: 'Connect with potential investors, partners, and suppliers through organized events like exhibitions, seminars, and networking meetups.' },
  //   { title: 'Marketing Support', description: 'Strategy development, brand building, digital campaigns, and awareness-raising for your product or service.' },
  //   { title: 'Infrastructure', description: 'Access to offices or co-working spaces, reducing costs and fostering collaboration and creativity.' },
  //   { title: 'Technology Resources', description: 'Access to current tools, software, and technologies to improve operations and product development.' },
  //   { title: 'Growth Support', description: 'Assistance expanding into new local or international markets, including logistics, regulatory, and marketing support.' }
  // ];

  activeAccelerationIndex: number | null = null;

  toggleAcceleration(index: number) {
    this.activeAccelerationIndex = this.activeAccelerationIndex === index ? null : index;
  }

  toggleProgram(index: number) {
    this.activeIndex = this.activeIndex === index ? null : index;
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
