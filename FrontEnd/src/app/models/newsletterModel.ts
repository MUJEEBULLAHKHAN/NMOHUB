export class Newsletter {
  newsletterId: number = 0;   // default 0 → backend generates on create
  title: string = '';
  titleArabic: string = '';
  content: string = '';
  contentArabic: string = '';
  category: string = '';
  createdDate?: string;
  createdBy?: number;
}
