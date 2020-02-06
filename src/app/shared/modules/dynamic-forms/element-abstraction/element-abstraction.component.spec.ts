import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementAbstractionComponent } from './element-abstraction.component';

describe('ElementAbstractionComponent', () => {
  let component: ElementAbstractionComponent;
  let fixture: ComponentFixture<ElementAbstractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementAbstractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementAbstractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
