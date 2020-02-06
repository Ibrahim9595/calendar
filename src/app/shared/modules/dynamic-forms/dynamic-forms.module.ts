import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilderComponent } from './form-builder/form-builder.component';
import { from } from 'rxjs';
import { ElementAbstractionComponent } from './element-abstraction/element-abstraction.component';
// import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // TranslateModule,
  ],
  declarations: [
    FormBuilderComponent,
    ElementAbstractionComponent,
  ],
  exports: [
    FormBuilderComponent,
  ]
})
export class DynamicFormsModule { }
