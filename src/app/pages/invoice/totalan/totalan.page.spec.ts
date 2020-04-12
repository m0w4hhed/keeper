import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TotalanPage } from './totalan.page';

describe('TotalanPage', () => {
  let component: TotalanPage;
  let fixture: ComponentFixture<TotalanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TotalanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
