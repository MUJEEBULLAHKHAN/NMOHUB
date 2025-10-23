import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForeignerEntrepreneurProjectComponent } from './foreigner-entrepreneur-project.component';

describe('ForeignerEntrepreneurProjectComponent', () => {
  let component: ForeignerEntrepreneurProjectComponent;
  let fixture: ComponentFixture<ForeignerEntrepreneurProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForeignerEntrepreneurProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignerEntrepreneurProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
