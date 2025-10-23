import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ServiceApi } from '../../../../shared/services/twsbservices/service.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminPages, Service } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { AdminPageService } from '../../../../shared/services/twsbservices/adminpage.service';



@Component({
  selector: 'app-pages-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './pages-admin.component.html',
  styleUrl: './pages-admin.component.scss'
})




export class PagesAdminComponent {


  name = 'Angular 6';
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };


  adminPageModel = new AdminPages();
  adminPageList!: AdminPages[];

  temps: any;
  showMessageTypeActionRow: boolean = false;


  @ViewChild('modalServicePopUp') modalServicePopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public service: AdminPageService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.GetAllAdminPages();
  }


  GetAllAdminPages() {

    this.service.GetAllAdminPages().subscribe(x => {
      if (x.ok == true) {
        this.adminPageList = x.body.data;
        this.temps = x.body.data;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }


  AdminPagePopUp() {
    this.adminPageModel = new AdminPages();
    this.adminPageModel.adminPageId = 0;
    this.modalService.open(this.modalServicePopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.adminPageModel.adminPageTitle == null || this.adminPageModel.adminPageTitle == "" || this.adminPageModel.adminPageTitle == undefined ||
      this.adminPageModel.adminPageDescription == null || this.adminPageModel.adminPageDescription == "" || this.adminPageModel.adminPageDescription == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.service.CreateAdminPage(this.adminPageModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Added Successfully");
        this.adminPageModel = new AdminPages();
        this.modalService.dismissAll();
        this.GetAllAdminPages();
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);

    });
  }

  EditAdminPage(item: any) {
    this.adminPageModel = new AdminPages();
    this.modalService.open(this.modalServicePopUp, { backdrop: 'static' });
    this.adminPageModel = item;
  }

  UpdateAdminPage() {
    if (this.adminPageModel.adminPageTitle == null || this.adminPageModel.adminPageTitle == "" || this.adminPageModel.adminPageTitle == undefined ||
      this.adminPageModel.adminPageName == null || this.adminPageModel.adminPageName == "" || this.adminPageModel.adminPageName == undefined ||
      this.adminPageModel.adminPageDescription == null || this.adminPageModel.adminPageDescription == "" || this.adminPageModel.adminPageDescription == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.service.UpdateAdminPage(this.adminPageModel.adminPageId, this.adminPageModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();

        this.adminPageModel = new AdminPages();
        this.adminPageModel.adminPageId = 0;
        this.GetAllAdminPages();
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
      if (d.name != null && d.name != undefined && d.name != null
        && d.description != null && d.description != undefined && d.description != null
      ) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val ||
          d.description.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.adminPageList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

  // serviceByMessageType(MessageType: string) {

  //   this.service.serviceByMessageType(MessageType).subscribe(x => {
  //     if (x.ok == true) {
  //       if (x.body.success) {
  //         if (x.body.data != null) {
  //           this.serviceModel = x.body.data;
  //         }


  //       } else {
  //         this.toastr.displayErrorMessage('NMO', x.body.message);

  //       }
  //     }
  //     else {
  //       this.toastr.displayErrorMessage('NMO', x.body.message);

  //     }

  //   }, (error) => {
  //     if (error.status == 400) {
  //       this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to get SMS template');
  //     }
  //     else {
  //       this.toastr.displayErrorMessage('NMO', error.message);
  //     }

  //   });
  // }


}
