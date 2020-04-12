import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BiayaKeepPage } from './biaya-keep.page';

describe('BiayaKeepPage', () => {
  let component: BiayaKeepPage;
  let fixture: ComponentFixture<BiayaKeepPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiayaKeepPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BiayaKeepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
