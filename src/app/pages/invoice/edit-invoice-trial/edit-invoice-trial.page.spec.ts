import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditInvoiceTrialPage } from './edit-invoice-trial.page';

describe('EditInvoiceTrialPage', () => {
  let component: EditInvoiceTrialPage;
  let fixture: ComponentFixture<EditInvoiceTrialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInvoiceTrialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditInvoiceTrialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
