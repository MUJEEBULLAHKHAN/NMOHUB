import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../../../../shared/services/twsbservices/workshop.service';
import { AppComponent } from '../../../../app.component';
import { UserRM } from '../../../../models/user';
import { Workshops } from '../../../../models/Workshops';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { ProjectStatus } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-project-stage-admin',
  standalone: false,
  // imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './project-stage-admin.component.html',
  styleUrl: './project-stage-admin.component.scss'
})
export class ProjectStageAdminComponent {

  user = new UserRM();
  projectStatus = new ProjectStatus();
  projectStatusList: ProjectStatus[] = [];
  //vehicleModelList:ModelType[]=[];
  masterProjectStatusList = [];
  showProjectStatusActionRow: boolean = false;

  //workshop: any;

  constructor(private route: ActivatedRoute, public router: Router, public workshopService: WorkshopService,
    public appComponent: AppComponent, public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.GetAllProjectStatus();
  }

  GetAllProjectStatus() {
    this.referenceService.GetAllProjectStatus().subscribe(x => {
      if (x.ok == true) {
        this.projectStatusList = x.body;
        this.masterProjectStatusList = x.body;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }
    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }

  searchProjectStatusList(event: any) {
    const val = event.target.value.toLowerCase();
    if (event.target.value.length <= 1) {
      this.projectStatusList = this.masterProjectStatusList;
    }
    // filter our data
    const temp = this.projectStatusList.filter(function (d) {
      if (d.name != null && d.name != undefined && d.name != "") {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
      return;
    });

    // update the rows
    this.projectStatusList = temp;
    // Whenever the filter changes, always go back to the first page

  }

  AddNewProjectStatus() {
    this.projectStatus = new ProjectStatus();
    this.projectStatus.id = 0;
    this.showProjectStatusActionRow = true;
  }

  cancelProjectStatusAdd() {
    this.showProjectStatusActionRow = false;
    this.projectStatus = new ProjectStatus();
    this.projectStatus.id = 0;
  }


  submitProjectStatus(status: any) {
    if (status == undefined || status == "" || status == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter Status");
      return;
    }
    let _projectStatus = new ProjectStatus();
    _projectStatus.name = status;

    this.referenceService.CreateProjectStatus(_projectStatus).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'Project Type added successfully');
        this.cancelProjectStatusAdd();
        this.GetAllProjectStatus();

        this.projectStatus = new ProjectStatus();
        this.projectStatus.id = 0;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      console.log(JSON.stringify(error));

    });
  }

  Edit(item: any) {
     this.projectStatus = item;
    this.showProjectStatusActionRow = true;
  }


  updateProjectStatus(ProjectStatus: any) {
    if (ProjectStatus == undefined || ProjectStatus == "" || ProjectStatus == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter Project Status");
      return;
    }
    

    this.referenceService.UpdateProjectStatus(this.projectStatus.id, this.projectStatus).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'City added successfully');
        this.cancelProjectStatusAdd();
        this.GetAllProjectStatus();

        this.projectStatus = new ProjectStatus();
        this.projectStatus.id = 0;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      console.log(JSON.stringify(error));

    });
  }

}
