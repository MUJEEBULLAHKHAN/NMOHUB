import { Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../../shared/models/authentication';
import { UserAuthService } from '../../../shared/services/twsbservices/user-auth.service';
import { NMOService } from '../../../shared/services/new.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { Service, Package } from '../../../models/Reference';
import { PackageService } from '../../../shared/services/twsbservices/package.service';
import {
  ProjectRequestVM, ProjectRequest, RegisterUserVM, EmailVerifyModel, SupportNeeds, Partner, OtherProgramAttend,
  DocumentData
} from '../../../models/new-service';
import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-customer-application-track',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './customer-application-track.component.html',
  styleUrl: './customer-application-track.component.scss'
})
export class CustomerApplicationTrackComponent implements OnInit, OnDestroy {

fullName: any;
applicationNo: any;
  projectId: any;

  constructor(
    public authservice: NMOService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastr: DisplaymessageComponent,
    public service: ServiceApi,
    private modalService: NgbModal,
    public packageService: PackageService,
  ) {
  
    
  }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
        this.applicationNo = this.route.snapshot.queryParamMap.get('caseid');
        this.fullName = this.route.snapshot.queryParamMap.get('fullName');
        this.projectId = this.route.snapshot.queryParamMap.get('id');

  // http://localhost:4200/customer-project-confirmation?caseid=45
  }
  

}