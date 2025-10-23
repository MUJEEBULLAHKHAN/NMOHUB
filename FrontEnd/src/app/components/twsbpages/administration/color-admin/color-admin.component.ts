import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../../../../shared/services/twsbservices/workshop.service';
import { AppComponent } from '../../../../app.component';
import { UserRM } from '../../../../models/user';
import { Workshops } from '../../../../models/Workshops';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { Color } from '../../../../models/Reference';

import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-color-admin',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './color-admin.component.html',
  styleUrl: './color-admin.component.scss'
})
export class ColorAdminComponent {

 user = new UserRM();
 colorList: Color[] = [];
 masterColorList: any=[];
 showColorActionRow:boolean=false;

 @ViewChild('modalAddWorkshopPopUp') modalAddWorkshopPopUp: TemplateRef<any> | undefined;
 @ViewChild('modalUpdateWorkshopPopUp') modalUpdateWorkshopPopUp: TemplateRef<any> | undefined;

 //workshop: any;

 constructor(private route: ActivatedRoute, 
  public router: Router, 
  public workshopService: WorkshopService,
   public appComponent: AppComponent, 
   private modalService: NgbModal, 
   public referenceService: ReferenceService,
   private toastr: DisplaymessageComponent
 ) {
  document.querySelector('.single-page-header')?.classList.add('d-none');
 }

 ngOnInit(): void {

   this.user = JSON.parse(localStorage.getItem('userdetails') as string)
   this.GetAllColor();
 }

 GetAllColor() {
   this.referenceService.GetAllcolors().subscribe(x => {
     if (x.ok == true) {
       this.colorList = x.body;
       this.masterColorList = this.colorList;
       
     }
     else {
       this.toastr.displayErrorMessage('NMO', x.body.message);
       
     }

   }, (error) => {
     this.toastr.displayErrorMessage('NMO', error.message);
     
   });
 }


 searchColorList(event: any) {
   const val = event.target.value.toLowerCase();
   if (event.target.value.length <= 1) {
     this.colorList = this.masterColorList;
   }
   // filter our data
   const temp = this.colorList.filter(function (d) {
    if (d.colorName !=undefined && d.colorName !=null && d.colorName !="") {
      return d.colorName.toLowerCase().indexOf(val) !== -1 || !val;
    }
     return;
   });

   // update the rows
   this.colorList = temp;
   // Whenever the filter changes, always go back to the first page

 }

 AddNewColor() {

   this.showColorActionRow = true;
 }

 cancelColorAdd() {
   this.showColorActionRow = false;
 }

 submitNewColor(color: any) {
   if (color == undefined || color == "" || color == null) {
     this.toastr.displayErrorMessage('NMO', "Please Enter Color");
     return;
   }
   let _color = new Color();
   _color.colorName = color;

   this.referenceService.UpdateColour(_color).subscribe(x => {
     if (x.ok == true) {
      this.toastr.displaySuccessMessage('success', 'make added successfully');
       this.colorList = x.body;
       
       this.cancelColorAdd()
     }
     else {
       this.toastr.displayErrorMessage('NMO', x.body.message);
       
     }

   }, (error) => {
     this.toastr.displayErrorMessage('NMO', error.message);
     
   });
 }

}
