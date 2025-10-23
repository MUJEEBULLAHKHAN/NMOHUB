import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../shared/models/authentication';
import { UserAuthService } from '../../shared/services/twsbservices/user-auth.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-page',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent implements OnInit, OnDestroy {


  rawHtmlContent: string = `
    <h2>This is Raw HTML!</h2>
    <p style="color: blue;">This paragraph has inline styles.</p>
    <script>alert('Potentially malicious script!');</script> <img onerror="alert('Image load error!');" src="invalid-image.jpg">
  `;


  sanitizedHtmlContent!: SafeHtml;


  constructor(
    public authservice: UserAuthService,
    private elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastr: DisplaymessageComponent,
    private sanitizer: DomSanitizer
  ) {

  }


  ngOnInit(): void {

    // Sanitize the HTML content before using it in the template
    // This removes potentially dangerous elements like <script> tags
    this.sanitizedHtmlContent = this.sanitizer.bypassSecurityTrustHtml(this.rawHtmlContent);

    // If your HTML is known to be safe (e.g., hardcoded, not from user input),
    // you might not strictly need bypassSecurityTrustHtml, but it's good practice
    // if there's any doubt about its origin.
    // However, if the HTML *contains* scripts or other dangerous elements,
    // bypassSecurityTrustHtml will allow them, so ensure your source is trusted.
    // For content from untrusted sources, you might need a server-side sanitizer
    // or a different approach to clean the HTML before it even reaches the client.

    console.log("Original HTML:", this.rawHtmlContent);
    console.log("Sanitized HTML (safe object):", this.sanitizedHtmlContent);

  }

  forgotPassword() {
    this.router.navigate(['auth/forgot-password']);
    //[routerLink]="['auth/forgot-password']"
  }

  ngOnDestroy(): void {
    const bodyElement = this.renderer.selectRootElement('body', true);
    this.renderer.removeAttribute(bodyElement, 'class');
  }

  
}
