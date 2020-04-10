import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListTokoPage } from './list-toko.page';

describe('ListTokoPage', () => {
  let component: ListTokoPage;
  let fixture: ComponentFixture<ListTokoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTokoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTokoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
