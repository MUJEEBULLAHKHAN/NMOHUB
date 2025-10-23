import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { Newsletter } from '../../../../models/newsletterModel';
import { NewsletterService } from '../../../../shared/services/twsbservices/newsletter.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-newsletter-admin',
  standalone: true,
  providers: [DisplaymessageComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DatePipe, FormsModule, AngularEditorModule],
  templateUrl: './newsletter-admin.component.html',
  styleUrls: ['./newsletter-admin.component.scss']
})
export class NewsletterAdminComponent implements OnInit {

  newsletters: Newsletter[] = [];
  newsletterModel: Newsletter = new Newsletter();
  showLoader = false;

  @ViewChild('modalNewsletterPopUp') modalNewsletterPopUp!: TemplateRef<any>;

  constructor(
    private newsletterService: NewsletterService,
    private modalService: NgbModal,
    private toastr: DisplaymessageComponent
  ) { }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
  };

  ngOnInit(): void {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.getAll();
  }

  getAll() {
    this.showLoader = true;
    this.newsletterService.getAll().subscribe({
      next: (res) => {
        this.showLoader = false;
        this.newsletters = res;
      },
      error: (err) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('Error', err.message);
      }
    });
  }

  openModal() {
    this.newsletterModel = new Newsletter(); // reset for Add
    this.modalService.open(this.modalNewsletterPopUp, {
      backdrop: 'static', size: 'xl'
    });
  }

  edit(item: Newsletter) {
    this.newsletterService.getById(item.newsletterId).subscribe({
      next: (res) => {
        this.newsletterModel = res;
        this.modalService.open(this.modalNewsletterPopUp, {
          backdrop: 'static', size: 'xl'
        });
      },
      error: (err) => {
        this.toastr.displayErrorMessage('Error', err.message);
      }
    });
  }

  save() {
    if (!this.newsletterModel.title || !this.newsletterModel.content) {
      this.toastr.displayErrorMessage('Error', 'Title & Content are required.');
      return;
    }
    const contentSize = new Blob([this.newsletterModel.content]).size;
    if (contentSize > 1024 * 1024) {
      this.toastr.displayErrorMessage('Error', 'Content size exceeds 1 MB. Please reduce text or images.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('userinfo') || '{}');
    const createdBy = Number(user?.userDetails?.employeeId || 0);

    if (!this.newsletterModel.newsletterId || this.newsletterModel.newsletterId === 0) {
      // CREATE payload (no newsletterId)
      const payload = {
        title: this.newsletterModel.title,
        titleArabic: this.newsletterModel.titleArabic,
        content: this.newsletterModel.content,
        contentArabic: this.newsletterModel.contentArabic,
        category: this.newsletterModel.category,
        createdBy: createdBy // always number
      };

      this.newsletterService.create(payload as any).subscribe({
        next: () => {
          this.toastr.displaySuccessMessage('Success', 'Newsletter created.');
          this.modalService.dismissAll();
          this.getAll();
        },
        error: (err) => this.toastr.displayErrorMessage('Error', err.message)
      });
    } else {
      // UPDATE payload (include newsletterId)
      const payload = {
        newsletterId: this.newsletterModel.newsletterId,
        title: this.newsletterModel.title,
        titleArabic: this.newsletterModel.titleArabic,
        content: this.newsletterModel.content,
        contentArabic: this.newsletterModel.contentArabic,
        category: this.newsletterModel.category,
        createdBy: createdBy
      };

      this.newsletterService.update(this.newsletterModel.newsletterId!, payload).subscribe({
        next: () => {
          this.toastr.displaySuccessMessage('Success', 'Newsletter updated.');
          this.modalService.dismissAll();
          this.getAll();
        },
        error: (err) => this.toastr.displayErrorMessage('Error', err.message)
      });
    }
  }


  delete(id: number) {
    if (confirm('Are you sure you want to delete this newsletter?')) {
      this.newsletterService.delete(id).subscribe({
        next: () => {
          this.toastr.displaySuccessMessage('Success', 'Deleted successfully.');
          this.getAll();
        },
        error: (err) => this.toastr.displayErrorMessage('Error', err.message)
      });
    }
  }
}
