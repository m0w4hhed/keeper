import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EkspedisiPage } from './ekspedisi.page';

describe('EkspedisiPage', () => {
  let component: EkspedisiPage;
  let fixture: ComponentFixture<EkspedisiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EkspedisiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EkspedisiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
