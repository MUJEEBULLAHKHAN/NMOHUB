import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NMOService } from '../../../../shared/services/new.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-co-working-space-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,DatePipe],
  templateUrl: './co-working-space-admin.component.html',
  styleUrl: './co-working-space-admin.component.scss',
  providers: [DisplaymessageComponent]

})
export class CoWorkingSpaceAdminComponent {

  coWorkingSpaceForm!: FormGroup;

  constructor(private nmoService: NMOService, private fb: FormBuilder, private toastr: DisplaymessageComponent) { }

  ngOnInit(): void {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.coWorkingSpaceForm = this.fb.group({
      coWorkingSpaceId: [null],
      price: [0, [Validators.required, Validators.min(1)]],
      totalQuantity: [0, [Validators.required, Validators.min(1)]],
      deskType: ['', Validators.required],
      accessScopeHour: [0, [Validators.required, Validators.min(1)]],

    });
    this.GetAllCoWorkingSpace();
  }
  ngOnDestroy() {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }
  GetAllCoWorkingSpace(): void {
    this.nmoService.GetAllCoWorkingSpace().subscribe({
      next: (res) => {
        const firstCoWorking = res.body.data[0];
        if (firstCoWorking) {
          this.coWorkingSpaceForm.patchValue(firstCoWorking);
          this.coWorkingSpaceForm.markAsPristine();
        }
      },
      error: (err) => {
        console.error('Error fetching rooms:', err);
      }
    });
  }
  updateCoWorkingSpaceForm(): void {
    if (!this.coWorkingSpaceForm.valid) return;

    const coWorkingSpaceData = this.coWorkingSpaceForm.value;
    const id = coWorkingSpaceData.coWorkingSpaceId;
    if (!id) return;
    this.nmoService.CoWorkingSpaceUpdate(id, coWorkingSpaceData).subscribe({
      next: () => {
        this.toastr.displaySuccessMessage('Success', 'Meeting room updated successfully!');
        this.coWorkingSpaceForm.markAsPristine();
      },
      error: (err) => {
        console.error('Error updating room:', err);
      }
    });
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.coWorkingSpaceForm.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }
}
