import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkshopSurveyQuestion, AnswerType } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { UserRM } from '../../../../models/user';
@Component({
  selector: 'app-workshop-survey-question-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './workshop-survey-question-admin.component.html',
  styleUrl: './workshop-survey-question-admin.component.scss'
})
export class WorkshopSurveyQuestionAdminComponent {

  user = new UserRM();
  workshopSurveyQuestionModel = new WorkshopSurveyQuestion();
  workshopSurveyQuestionList!: WorkshopSurveyQuestion[];
  answerTypeList!: AnswerType[];
  temps!: WorkshopSurveyQuestion[];
  showMessageTypeActionRow: boolean = false;


  @ViewChild('modalSurveyQuestionPopUp') modalSurveyQuestionPopUp: TemplateRef<any> | undefined;

  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.GetAllAnswerTypes();
    this.GetAllWorkshopSurveyQuestion();
  }
  

  GetAllWorkshopSurveyQuestion() {
    
    this.referenceService.GetAllWorkshopSurveyQuestion().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.workshopSurveyQuestionList = x.body.data;
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

  GetAllAnswerTypes() {
    
    this.referenceService.GetAllAnswerTypes().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.answerTypeList = x.body.data;
          this.temps = x.body.data;
          
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

  AddWorkshopSurveyQuestionPopUp() {
    this.workshopSurveyQuestionModel = new WorkshopSurveyQuestion();
    this.workshopSurveyQuestionModel.workshopSurveyQuestionId = 0;
    this.modalService.open(this.modalSurveyQuestionPopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.workshopSurveyQuestionModel.answerTypeId == null || this.workshopSurveyQuestionModel.answerTypeId <= 0 || this.workshopSurveyQuestionModel.answerTypeId == undefined ||
      this.workshopSurveyQuestionModel.question == null || this.workshopSurveyQuestionModel.question == "" || this.workshopSurveyQuestionModel.question == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    
    this.referenceService.CreateWorkshopSurveyQuestions(this.workshopSurveyQuestionModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.workshopSurveyQuestionModel = new WorkshopSurveyQuestion();
          this.modalService.dismissAll();
          
          this.GetAllWorkshopSurveyQuestion();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  Update() {
    if (this.workshopSurveyQuestionModel.answerTypeId == null || this.workshopSurveyQuestionModel.answerTypeId <= 0 || this.workshopSurveyQuestionModel.answerTypeId == undefined ||
      this.workshopSurveyQuestionModel.question == null || this.workshopSurveyQuestionModel.question == "" || this.workshopSurveyQuestionModel.question == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    
    this.referenceService.UpdateWorkshopSurveyQuestions(this.workshopSurveyQuestionModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
          this.workshopSurveyQuestionModel = new WorkshopSurveyQuestion();
          this.modalService.dismissAll();
          
          this.GetAllWorkshopSurveyQuestion();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  Edit(item: any) {
    this.workshopSurveyQuestionModel = new WorkshopSurveyQuestion();
    this.modalService.open(this.modalSurveyQuestionPopUp, { backdrop: 'static' });
    this.workshopSurveyQuestionModel = item;

  }

  Delete(WorkshopSurveyQuestionId: number) {
    this.referenceService.DeleteWorkshopSurveyQuestions(WorkshopSurveyQuestionId).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Deleted Successfully");
        this.GetAllWorkshopSurveyQuestion();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.type != null && d.type != undefined && d.type != null
        && d.question != null && d.question != undefined && d.question != null
      ) {
        return d.type.toLowerCase().indexOf(val) !== -1 || !val ||
          d.question.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.workshopSurveyQuestionList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }
}
