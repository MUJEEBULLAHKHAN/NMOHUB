import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../../../../shared/services/twsbservices/workshop.service';
import { AppComponent } from '../../../../app.component';
import { UserRM } from '../../../../models/user';
import { Workshops } from '../../../../models/Workshops';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { ProjectType } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-project-type-admin',
  standalone: false,
  // imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './project-type-admin.component.html',
  styleUrl: './project-type-admin.component.scss'
})
export class ProjectTypeAdminComponent {

  user = new UserRM();
  projectType = new ProjectType();
  projectTypeList: ProjectType[] = [];
  //vehicleModelList:ModelType[]=[];
  masterProjectTypeList = [];
  showProjectTypeActionRow: boolean = false;

  //workshop: any;

  constructor(private route: ActivatedRoute, public router: Router, public workshopService: WorkshopService,
    public appComponent: AppComponent, public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.GetAllProjectType();
  }

  GetAllProjectType() {
    this.referenceService.GetAllProjectType().subscribe(x => {
      if (x.ok == true) {
        this.projectTypeList = x.body;
        this.masterProjectTypeList = x.body;

      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }

  searchProjectTypeList(event: any) {
    const val = event.target.value.toLowerCase();
    if (event.target.value.length <= 1) {
      this.projectTypeList = this.masterProjectTypeList;
    }
    // filter our data
    const temp = this.projectTypeList.filter(function (d) {
      if (d.name != null && d.name != undefined && d.name != "") {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
      return;
    });

    // update the rows
    this.projectTypeList = temp;
    // Whenever the filter changes, always go back to the first page

  }

  AddNewProjectType() {
    this.projectType = new ProjectType();
    this.projectType.id = 0;
    this.showProjectTypeActionRow = true;
  }

  cancelProjectTypeAdd() {
    this.showProjectTypeActionRow = false;
    this.projectType = new ProjectType();
    this.projectType.id = 0;
  }


  submitProjectType(projectType: any) {
    if (projectType == undefined || projectType == "" || projectType == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter City");
      return;
    }
    let _make = new ProjectType();
    _make.name = projectType;

    this.referenceService.CreateProjectType(_make).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'Project Type added successfully');
        this.cancelProjectTypeAdd();
        this.GetAllProjectType();

        this.projectType = new ProjectType();
        this.projectType.id = 0;
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
     this.projectType = item;
    this.showProjectTypeActionRow = true;
  }


  updateProjectType(ProjectType: any) {
    if (ProjectType == undefined || ProjectType == "" || ProjectType == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter Project Type");
      return;
    }
    

    this.referenceService.UpdateProjectType(this.projectType.id, this.projectType).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'City added successfully');
        this.cancelProjectTypeAdd();
        this.GetAllProjectType();

        this.projectType = new ProjectType();
        this.projectType.id = 0;
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
