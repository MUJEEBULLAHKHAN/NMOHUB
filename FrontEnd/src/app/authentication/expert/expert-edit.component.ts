import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Expert, ExpertService, AreaOfExpertise } from '../../shared/services/twsbservices/expert.service';

@Component({
  selector: 'app-expert-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './expert-edit.component.html',
  styleUrl: './expert-edit.component.scss'
})
export class ExpertEditComponent implements OnInit {
  expert: Expert | undefined;
  idTypeOptions: string[] = ['National ID', 'Iqama', 'Passport'];
  areasOfExpertise: AreaOfExpertise[] = [];
  loading = false;
  error = '';
  saving = false;
  step: number = 1;
  lastStep: number = 3;

  constructor(private route: ActivatedRoute, private router: Router, private expertService: ExpertService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;
    if (!isNaN(id)) {
      this.fetchExpert(id);
      this.loadAreasOfExpertise();
    } else {
      this.error = 'Invalid expert id';
    }
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

  fetchExpert(id: number): void {
    this.loading = true;
    this.expertService.getExpertProfile(id).subscribe({
      next: (res) => {
        this.expert = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load expert';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onProfilePictureSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !this.expert) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string | null;
      if (result && this.expert) {
        this.expert.profilePicture = result;
      }
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    if (!this.expert) return;
    this.saving = true;
    this.expertService.updateExpertProfile(this.expert.expertID, this.expert).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/expert', this.expert?.expertID, 'view']);
      },
      error: (err) => {
        this.saving = false;
        this.error = 'Failed to save changes';
        console.error(err);
      }
    });
  }

  private setActive(active: boolean): void {
    if (!this.expert) return;
    const call$ = active ? this.expertService.activateExpert(this.expert.expertID) : this.expertService.deactivateExpert(this.expert.expertID);
    call$.subscribe({
      next: () => {
        this.expert!.status = active ? 'Active' : 'Inactive';
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  isActive(): boolean {
    return (this.expert?.status || '').toLowerCase() === 'active';
  }

  onStatusToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.setActive(checked);
  }

  onAreaOfExpertiseChange(areaId: number, event: Event) {
    if (!this.expert) return;
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    
    if (isChecked) {
      if (!this.expert.areaOfExpertise.includes(areaId)) {
        this.expert.areaOfExpertise.push(areaId);
      }
    } else {
      this.expert.areaOfExpertise = this.expert.areaOfExpertise.filter(id => id !== areaId);
    }
  }

  isAreaSelected(areaId: number): boolean {
    return this.expert?.areaOfExpertise.includes(areaId) || false;
  }

  getSelectedAreasNames(): string {
    if (!this.expert) return '';
    return this.expert.areaOfExpertise
      .map(id => this.areasOfExpertise.find(area => area.areaOfExpertiseID === id)?.name)
      .filter(name => name)
      .join(', ');
  }

  GoToStep(stepNumber: number) {
    if (stepNumber < 1 || stepNumber > this.lastStep) return;
    this.step = stepNumber;
  }

  GoToNext() {
    if (this.step < this.lastStep) {
      this.step += 1;
    }
  }

  GoToPrevious() {
    if (this.step > 1) {
      this.step -= 1;
    }
  }
}


