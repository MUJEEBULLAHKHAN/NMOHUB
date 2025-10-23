import { Component, OnInit } from '@angular/core';
import { NMOService } from '../../../shared/services/new.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-meeting-access-room-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './meeting-access-room-admin.component.html',
  styleUrls: ['./meeting-access-room-admin.component.scss'],
  providers: [DisplaymessageComponent]

})
export class MeetingAccessRoomAdminComponent implements OnInit {

  roomForm!: FormGroup;   // ✅ Reactive form

  constructor(private nmoService: NMOService, private fb: FormBuilder, private toastr: DisplaymessageComponent) { }

  ngOnInit(): void {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.roomForm = this.fb.group({
      meetingAccessRoomId: [null],
      totalMeetingRooms: [0, [Validators.required, Validators.min(1)]],
      seatingCapacity: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      bIllingCycleUnit: ['', Validators.required],
      dailyHours: [0, [Validators.required, Validators.min(1)]],
      features: [''],
      description: ['']
    });

    this.getAllMeetingRooms();
  }
  ngOnDestroy() {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }

  // ✅ GET first item and patch to form
  getAllMeetingRooms(): void {
    this.nmoService.GetAllMeetingAccessRoom().subscribe({
      next: (res) => {
        const firstRoom = res.body[0];
        if (firstRoom) {
          this.roomForm.patchValue(firstRoom);
          this.roomForm.markAsPristine();
        }
      },
      error: (err) => {
        console.error('Error fetching rooms:', err);
      }
    });
  }

  // ✅ PUT update call
  updateMeetingRoom(): void {
    if (!this.roomForm.valid) return;

    const roomData = this.roomForm.value;
    const id = roomData.meetingAccessRoomId;

    if (!id) return;

    this.nmoService.updateMeetingAccessRoom(id, roomData).subscribe({
      next: () => {
        this.toastr.displaySuccessMessage('Success', 'Meeting room updated successfully!');
        this.roomForm.markAsPristine();
      },
      error: (err) => {
        console.error('Error updating room:', err);
      }
    });
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.roomForm.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }
}
