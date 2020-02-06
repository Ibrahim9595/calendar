import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FormElement } from '../interfaces/utils';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit, OnDestroy {
  formBuilder: FormGroup;
  subscribtions: Subscription[] = [];
  @Input() form: FormElement[];
  @Input() fixedValues: any;
  @Input() values: any;
  @Output() save = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.formBuilder = this.fb.group(this.parseForm(this.form));

    this.startListeners();

    if (this.values) {
      this.formBuilder.patchValue(this.values);
    }
  }

  ngOnDestroy() {
    this.subscribtions.forEach(sub => sub.unsubscribe());
  }

  createArrayControls(el: FormElement) {
    if (this.values && this.values[el.name]) {
      return this.values[el.name].map(() => this.fb.group({
        ...this.parseForm(el.scheme),
        id: this.values[el.name].id ? this.values[el.name].id : Date.now().toString(),
      }));
    }

    return [];
  }

  startListeners() {
    this.form.forEach(el => {
      if (el.listner) {
        this.subscribtions.push(this.formBuilder.controls[el.name].valueChanges.subscribe(value =>
          el.listner(value, this.formBuilder.controls)));
      }
    });
  }

  parseForm(form: FormElement[]): FormGroup | {} {
    const formGroup = {} as FormGroup;

    (form || []).forEach(f => {
      if (f.inputType === 'formArray') {
        formGroup[f.name] = this.fb.array(this.createArrayControls(f));
      } else if (f.inputType === 'formGroup') {
        formGroup[f.name] = this.fb.group(this.parseForm(f.scheme));
      } else {
        if (!f.isDisabled) {
          formGroup[f.name] = [
            f.inputType === 'switch' ? false : '',
            this.parseValidators(f.validators)];
        }
      }
    });

    return formGroup;
  }

  parseValidators(validatorNames: string[]): Validators[] {
    const validators = [];

    (validatorNames || []).forEach(validatorName => {
      const s = validatorName.split(':');
      if (s.length > 1) {
        validators.push(Validators[s[0]](s[1]));
      } else {
        validators.push(Validators[validatorName]);
      }
    });

    return validators;
  }

  pushEl(el: FormElement) {
    (this.formBuilder.get(el.name) as FormArray).push(this.fb.group({
      ...this.parseForm(el.scheme),
      id: [Date.now().toString()]
    }));
  }

  removeEl(el: FormElement, index: number) {
    (this.formBuilder.get(el.name) as FormArray).removeAt(index);
  }

  getSubGroups(el: any): any {
    return this.formBuilder.controls[el.name]
  }

  saveForm() {
    this.save.emit({
      ...this.formBuilder.value,
      ...(this.fixedValues ? this.fixedValues : {}),
    });
  }
}
