import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormElement } from '../interfaces/utils';

@Component({
  selector: 'app-element-abstraction',
  templateUrl: './element-abstraction.component.html',
  styleUrls: ['./element-abstraction.component.css']
})
export class ElementAbstractionComponent implements OnInit {
  @Input() el: FormElement;
  @Input() values: Object;
  @Input() formBuilder: FormGroup;

  constructor() { }

  ngOnInit() { }

}
