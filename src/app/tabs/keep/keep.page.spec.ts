import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KeepPage } from './keep.page';

describe('KeepPage', () => {
  let component: KeepPage;
  let fixture: ComponentFixture<KeepPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeepPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KeepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
