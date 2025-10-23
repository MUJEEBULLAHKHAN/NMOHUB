import { BootstrapOptions, Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/services/app-state.service';
import { AdministratorService } from '../../../shared/services/twsbservices/administrator.service';
import { Router } from '@angular/router';
import { WorkshopnamechangeService } from '../../../shared/services/twsbservices/behavioursubjects/workshopnamechange.service';
import { UserAuthService } from '../../../shared/services/twsbservices/user-auth.service';
import { authentication } from '../../../shared/models/authentication';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-workshop-login-selection',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './workshop-login-selection.component.html',
  styleUrl: './workshop-login-selection.component.scss'
})
export class WorkshopLoginSelectionComponent implements OnInit {
  
  firstName:any;
  lastName:any;
  workshopId: number =0;
  workshops: any;
  userInfo: any;
  _workshops:any[]=[];
  showLoader:boolean=false;

  constructor(private appStateService: AppStateService,
              private administratorService:AdministratorService,
              private router:Router,
              private workshopNameSubject: WorkshopnamechangeService,
              public authservice: UserAuthService,
              private toastr: DisplaymessageComponent)
  {
     let layoutStyles:any = 'closed';
     this.appStateService.updateState({layoutStyles, menuStyles: '',navigationStyles:'' });
     document.querySelector('.sidemenu-toggle')?.classList.add('d-none');
     document.querySelector('.header-search-bar')?.setAttribute('style', 'display: none;');
     document.querySelector('.country-selector')?.setAttribute('style', 'display: none;'); 
     document.querySelector('.header-theme-mode')?.setAttribute('style', 'display: none;');
     document.querySelector('.cart-dropdown')?.setAttribute('style', 'display: none;');
     document.getElementById('messageDropdown')?.setAttribute('style', 'display: none;');
     document.getElementById('mainHeaderProfile')?.setAttribute('style', 'display: none;');
     document.getElementById('mainHeaderProfile')?.setAttribute('style', 'display: none;');
      document.querySelector('.single-page-header')?.classList.add('d-none');
      document.getElementById('btnSignOutFromWorkshopSelection')?.setAttribute('style','display:block;');
  }

  ngOnInit() {
    this.updatepageStyles('regular');
    this.updatewidthStyles('full-width');
    var _userInfo = JSON.parse(localStorage.getItem('userdetails')?? '');
    this.firstName = _userInfo.firstNames;
    this.lastName = _userInfo.lastName;
    this.GetAllWorkshop();
  }

  updatepageStyles(pageStyles: string) {
    this.appStateService.updateState({ pageStyles });
  }

  updatewidthStyles(widthStyles: string) {
    this.appStateService.updateState({ widthStyles });
  }

  ngOnDestroy() {

  }

  GetAllWorkshop() {
  
   this.userInfo = JSON.parse( localStorage.getItem('userdetails') as string)
   this.administratorService.WorkShopsByUsername(this.userInfo.emailAddress).subscribe(data => {
     if (data.ok) {
       this._workshops = [...data.body]; 
       this.workshops = this._workshops.filter(x => x.activeUser === true);
     } else {
     }
   }, (error) => {

   });
  }



  selectWorkshop(Item :any)
  {
      this.showLoader = true;

      const userName = JSON.parse(localStorage.getItem('userdetails')?? '');

      let _authModel = new authentication();
      _authModel.workshopId = Item.workshopId;
      _authModel.emailAddress = userName['emailAddress'];

      this.authservice.UpdateTokenWithWorkshop(_authModel).subscribe({
        next: (user) => 
        {
          if(user.body.success)
          {
            localStorage.removeItem('token');
            localStorage.setItem('token', JSON.stringify(user.body['token']));

            let layoutStyles:any = 'overlay';
            this.appStateService.updateState({layoutStyles, menuStyles: '',navigationStyles:'' });
            document.querySelector('.sidemenu-toggle')?.classList.remove('d-none');
            document.querySelector('.header-search-bar')?.setAttribute('style', 'display: block;');
            document.querySelector('.country-selector')?.setAttribute('style', 'display: block;'); 
            document.querySelector('.header-theme-mode')?.setAttribute('style', 'display: block;');
            document.querySelector('.cart-dropdown')?.setAttribute('style', 'display: block;');
            document.getElementById('messageDropdown')?.setAttribute('style', 'display: block;');
            document.getElementById('mainHeaderProfile')?.setAttribute('style', 'display: block;');
            document.getElementById('mainHeaderProfile')?.setAttribute('style', 'display: block;');
            document.querySelector('.single-page-header')?.classList.add('d-none');
            document.getElementById('btnSignOutFromWorkshopSelection')?.setAttribute('style','display:none;');

            // const html = document.documentElement;
            // html.setAttribute('data-vertical-style', 'overlay');
        
            localStorage.setItem('workshop', JSON.stringify(Item));
            this.workshopNameSubject.setWorkshopName(Item.workshopName, Item.workshopId);
            this.router.navigate(['dashboard-overview']);

          }
          else
          {
            this.toastr.displayErrorMessage('NMO','One or more validation errors occurred');
            this.showLoader = false;

          }
        },     
        error: (error) =>
        {
          this.toastr.displayErrorMessage('NMO',error.error);
          this.showLoader = false;

        },
        complete: () => {
          this.showLoader = false;
        } 
      });
  }
}
