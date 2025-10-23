import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { Expert, ExpertService, AreaOfExpertise } from '../../shared/services/twsbservices/expert.service';
import { environment } from '../../../environments/environment';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { NgSelectModule } from '@ng-select/ng-select';




@Component({
  selector: 'app-expert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, NgbModule, NgIf, HttpClientModule,
    NgSelectModule, FormsModule, ReactiveFormsModule, RouterModule
  ],
  templateUrl: './expert.component.html',
  styleUrl: './expert.component.scss',
  providers: [DisplaymessageComponent],
})
export class ExpertComponent implements OnInit {
  selected = []
  selectedTag!: any[];
  step: number = 1;
  lastStep: number = 3;
  idTypeOptions: string[] = ['National ID', 'Iqama', 'Passport'];
  areasOfExpertise: AreaOfExpertise[] = [];
  expert: Expert = {
    expertID: 0,
    fullName: '',
    email: '',
    phoneNumber: '',
    nationality: '',
    idType: '',
    idNumber: '',
    profilePicture: '',
    experienceYears: 0,
    educationDetails: '',
    linkedInProfileURL: '',
    status: '',
    createdAt: new Date().toISOString(),
    areaOfExpertise: []
  };

  responseMessage: string = '';
  showLoader = false;
  API = environment.baseAPIUrl

  constructor(private expertService: ExpertService, private router: Router,
    private toastr: DisplaymessageComponent,
  ) { }

  ngOnInit(): void {
    this.loadAreasOfExpertise();
  }

  loadAreasOfExpertise(): void {
    this.expertService.getAreasOfExpertise().subscribe({
      next: (areas) => {
        console.log('Areas of expertise loaded:', areas);
        this.areasOfExpertise = areas || [];
        // Fallback data for testing if API fails
        // if (this.areasOfExpertise.length === 0) {
        //   this.areasOfExpertise = [
        //     { areaOfExpertiseID: 1, areaName: 'Web Development', description: 'Frontend and Backend Development' },
        //     { areaOfExpertiseID: 2, areaName: 'Mobile Development', description: 'iOS and Android Development' },
        //     { areaOfExpertiseID: 3, areaName: 'Data Science', description: 'Machine Learning and Analytics' },
        //     { areaOfExpertiseID: 4, areaName: 'Cloud Computing', description: 'AWS, Azure, GCP' },
        //     { areaOfExpertiseID: 5, areaName: 'DevOps', description: 'CI/CD and Infrastructure' }
        //   ];
        // }
      },
      error: (err) => {
        console.error('Failed to load areas of expertise:', err);
        // Fallback data when API fails
        // this.areasOfExpertise = [
        //   { areaOfExpertiseID: 1, areaName: 'Web Development', description: 'Frontend and Backend Development' },
        //   { areaOfExpertiseID: 2, areaName: 'Mobile Development', description: 'iOS and Android Development' },
        //   { areaOfExpertiseID: 3, areaName: 'Data Science', description: 'Machine Learning and Analytics' },
        //   { areaOfExpertiseID: 4, areaName: 'Cloud Computing', description: 'AWS, Azure, GCP' },
        //   { areaOfExpertiseID: 5, areaName: 'DevOps', description: 'CI/CD and Infrastructure' }
        // ];
      }
    });
  }

  private isValidEmail(email: string | undefined | null): boolean {
    if (!email) return false;
    const pattern = /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;
    return pattern.test(email);
  }

  isValidForSubmit(): boolean {
    const hasName = !!(this.expert.fullName && this.expert.fullName.trim().length >= 2);
    const hasValidEmail = this.isValidEmail(this.expert.email);
    return hasName && hasValidEmail;
  }

  GoToStep(stepNumber: number) {
    if (stepNumber < 1 || stepNumber > this.lastStep) return;
    this.step = stepNumber;
  }

  GoToNext() {

    if (this.step == 2) {

      if (this.selectedTag == undefined || this.selectedTag.length <= 0) {
        this.toastr.displayErrorMessage('NMO', "Please Select Expertise");
        return;
      }

      this.expert.areaOfExpertise = [];
      this.onAreaOfExpertiseChange();
    }

    if (this.step < this.lastStep) {
      this.step += 1;
    }
  }

  GoToPrevious() {
    if (this.step > 1) {
      this.step -= 1;
    }
  }

  onProfilePictureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string | null;
      if (result) {
        this.expert.profilePicture = result; // data URL base64
      }
    };
    reader.readAsDataURL(file);
  }

  // onAreaOfExpertiseChange(areaId: number, event: Event) {
  //   const target = event.target as HTMLInputElement;
  //   const isChecked = target.checked;

  //   if (isChecked) {
  //     if (!this.expert.areaOfExpertise.includes(areaId)) {
  //       this.expert.areaOfExpertise.push(areaId);
  //     }
  //   } else {
  //     this.expert.areaOfExpertise = this.expert.areaOfExpertise.filter(id => id !== areaId);
  //   }
  // }

  onAreaOfExpertiseChange() {
    this.selectedTag.forEach((x: any) => {
      this.expert.areaOfExpertise.push(x)
    });
  }

  isAreaSelected(areaId: number): boolean {
    return this.expert.areaOfExpertise.includes(areaId);
  }

  getSelectedAreasNames(): string {
    return this.expert.areaOfExpertise
      .map(id => this.areasOfExpertise.find(area => area.areaOfExpertiseID == id)?.name)
      .filter(name => name)
      .join(', ');
  }

  onSubmit() {
    if (!this.isValidForSubmit()) {
      //this.responseMessage = 'Please fill required fields correctly before submitting.';
      this.toastr.displayErrorMessage('NMO', "Expert registered successfully!");
      return;
    }
    this.showLoader = true;
    this.expertService.registerExpert(this.expert).subscribe({
      next: (res) => {
        this.showLoader = false;
        this.toastr.displaySuccessMessage('NMO', "Expert registered successfully!");
        //this.responseMessage = 'Expert registered successfully!';
        console.log('API Response:', res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.showLoader = false;
        //this.responseMessage = 'Error registering expert!';
        this.toastr.displayErrorMessage('NMO', "Error registering expert!");
        console.error(err);
      }
    });
  }
}
