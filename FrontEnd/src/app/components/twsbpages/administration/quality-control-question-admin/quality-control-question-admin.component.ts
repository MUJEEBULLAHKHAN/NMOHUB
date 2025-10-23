import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QualityControlQuestions } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { UserRM } from '../../../../models/user';
import { AnswerType } from '../../../../models/Reference';
import { tr } from 'date-fns/locale';


@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-quality-control-question-admin',
  standalone: false,
  templateUrl: './quality-control-question-admin.component.html',
  styleUrl: './quality-control-question-admin.component.scss'
})
export class QualityControlQuestionAdminComponent {

  qualityControlQuestionModel = new QualityControlQuestions();
  qualityControlQuestionList!: QualityControlQuestions[];
  temps: QualityControlQuestions[] = [];
  user = new UserRM();
answerTypeList!: AnswerType[];
showLoader : boolean = false;
  @ViewChild('modalqualityControlQuestionPopUp') modalqualityControlQuestionPopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.GetAllQualityControlQuestion();
    this.GetAllAnswerTypes();
  }

  GetAllAnswerTypes() {
    this.showLoader = true;
    this.referenceService.GetAllAnswerTypes().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.answerTypeList = x.body.data;
          this.temps = x.body.data;
          this.showLoader = false;
          
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          this.showLoader = false;
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false;
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetAllQualityControlQuestion() {
    this.showLoader = true;
    this.referenceService.GetQualityControlQuestions().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.qualityControlQuestionList = x.body.data;
          this.temps = x.body.data;
          this.showLoader = false;
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          this.showLoader = false;
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false;
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      this.showLoader = false;
    });
  }

  QualityControlQuestionPopUp() {
    this.qualityControlQuestionModel = new QualityControlQuestions();
    this.qualityControlQuestionModel.id = 0;
    this.modalService.open(this.modalqualityControlQuestionPopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.qualityControlQuestionModel.question == null || this.qualityControlQuestionModel.question == "" || this.qualityControlQuestionModel.question == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    if (this.qualityControlQuestionModel.answerTypeId == null || this.qualityControlQuestionModel.answerTypeId <= 0 || this.qualityControlQuestionModel.answerTypeId == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.showLoader = true;
    this.referenceService.CreateQualityControlQuestions(this.qualityControlQuestionModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.showLoader = false;
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.qualityControlQuestionModel = new QualityControlQuestions();
          this.modalService.dismissAll();

          this.GetAllQualityControlQuestion();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          this.showLoader = false;
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false;
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to create role');
        this.showLoader = false;
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
        this.showLoader = false;
      }
    });
  }

  Edit(item: any) {
    this.qualityControlQuestionModel = new QualityControlQuestions();
    this.modalService.open(this.modalqualityControlQuestionPopUp, { backdrop: 'static' });
    this.qualityControlQuestionModel = item;
  }

  Update() {
    if (this.qualityControlQuestionModel.question == null || this.qualityControlQuestionModel.question == "" || this.qualityControlQuestionModel.question == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.showLoader = true;
    this.referenceService.UpdateQualityControlQuestions(this.qualityControlQuestionModel).subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();

        this.qualityControlQuestionModel = new QualityControlQuestions();
        this.qualityControlQuestionModel.id = 0;
        this.GetAllQualityControlQuestion();
      }
      else {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to update role');
        this.showLoader = false;
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
        this.showLoader = false;
      }

    });
  }

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.question != null && d.question != undefined && d.question != null
        && d.type != null && d.type != undefined && d.type != null
      ) {
        return d.question.toLowerCase().indexOf(val) !== -1 || !val ||
        d.type.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.qualityControlQuestionList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

}
