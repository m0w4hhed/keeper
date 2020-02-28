import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmbilanPage } from './ambilan.page';

describe('AmbilanPage', () => {
  let component: AmbilanPage;
  let fixture: ComponentFixture<AmbilanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AmbilanPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmbilanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
