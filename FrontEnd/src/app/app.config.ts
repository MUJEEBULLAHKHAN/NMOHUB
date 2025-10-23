import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { ColorPickerService } from 'ngx-color-picker';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withInterceptorsFromDi  } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SortablejsModule} from '@maksim_m/ngx-sortablejs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './translate-loader';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    RouterOutlet,
    ColorPickerService,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,  //
    AngularFireModule,
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    
    importProvidersFrom(
      FlatpickrModule.forRoot(),
      SortablejsModule.forRoot({ animation: 150 }),
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      }),
      NgbModule,
      ToastrService,
      BrowserAnimationsModule,
      ToastrModule.forRoot(),
      OverlayscrollbarsModule,
      AngularFireModule.initializeApp(environment.firebase),
   HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )

  ],
};
