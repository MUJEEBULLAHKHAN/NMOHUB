import { TwsbpagesmoduleModule } from '../../../../src/app/components/twsbpages/twsbpagesmodule.module'; // Adjust path as needed

@NgModule({
  declarations: [CustomerProjectTrackComponent],
  imports: [
    CommonModule, 
    TwsbpagesmoduleModule,  // Import this module here!
  ],
})
export class CustomerModule { }
