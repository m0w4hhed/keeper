import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifikasiInputPage } from './verifikasi-input.page';

describe('VerifikasiInputPage', () => {
  let component: VerifikasiInputPage;
  let fixture: ComponentFixture<VerifikasiInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifikasiInputPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifikasiInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
