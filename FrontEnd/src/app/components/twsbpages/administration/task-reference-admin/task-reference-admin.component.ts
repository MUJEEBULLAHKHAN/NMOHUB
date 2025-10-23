import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskReferenceDescription } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { JobService } from '../../../../shared/services/twsbservices/job.service';

@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-task-reference-admin',
  standalone: false,
  templateUrl: './task-reference-admin.component.html',
  styleUrl: './task-reference-admin.component.scss'
})
export class TaskReferenceAdminComponent {
  
  taskReferenceModel = new TaskReferenceDescription();
  taskReferenceList!: TaskReferenceDescription[];
   temps: TaskReferenceDescription[] = [];


  @ViewChild('modalTaskReferencePopUp') modalTaskReferencePopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent,
    private jobService:JobService,
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
     this.GetAllTaskReference();
  }


  GetAllTaskReference() {
    
    this.referenceService.GetAllTaskReference().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.taskReferenceList = x.body.data;
          this.temps =  x.body.data;
          
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  TaskReferencePopUp() {
    this.taskReferenceModel = new TaskReferenceDescription();
    this.taskReferenceModel.id = 0;
    this.modalService.open(this.modalTaskReferencePopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.taskReferenceModel.taskDescription == null || this.taskReferenceModel.taskDescription == "" || this.taskReferenceModel.taskDescription == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    this.referenceService.CreateTaskReference(this.taskReferenceModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.taskReferenceModel = new TaskReferenceDescription();
          this.modalService.dismissAll();
          
          this.GetAllTaskReference();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to create role');
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
        
      }
    });
  }

  EditTaskReference(item: any) {
    this.taskReferenceModel = new TaskReferenceDescription();
    this.modalService.open(this.modalTaskReferencePopUp, { backdrop: 'static' });
    this.taskReferenceModel = item;
  }

  Update() {
    if (this.taskReferenceModel.taskDescription == null || this.taskReferenceModel.taskDescription == "" || this.taskReferenceModel.taskDescription == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.referenceService.UpdateTaskReference(this.taskReferenceModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();
        
        this.taskReferenceModel = new TaskReferenceDescription();
        this.taskReferenceModel.id = 0;
        this.GetAllTaskReference();
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to update role');
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
      }
      
    });
  }

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.TaskDescription != null && d.TaskDescription != undefined && d.TaskDescription != null
      ) {
        return d.TaskDescription.toLowerCase().indexOf(val) !== -1 || !val ;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.taskReferenceList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

}
