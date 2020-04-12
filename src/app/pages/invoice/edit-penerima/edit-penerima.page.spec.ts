import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPenerimaPage } from './edit-penerima.page';

describe('EditPenerimaPage', () => {
  let component: EditPenerimaPage;
  let fixture: ComponentFixture<EditPenerimaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPenerimaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPenerimaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
