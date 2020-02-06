import { Component } from '@angular/core';
import { EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormElement } from './shared/modules/dynamic-forms/interfaces/utils';
import { EventsService } from './shared/services/models/events.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  show = false;
  selectedValues: any;
  eventsList$: BehaviorSubject<any[]>;

  form: FormElement[] = [
    {
      name: 'title',
      placeholder: 'عنوان المهمة',
      label: 'عنوان المهمة',
      errorMessage: 'هذا الحقل اجباري',
      inputType: 'text',
      outputType: 'single',
      validators: ['required'],
    },
    {
      name: 'startDay',
      placeholder: 'اختر يوم بداية المهمة ',
      label: 'يوم بداية المهمة',
      errorMessage: 'هذا الحقل يجب ان يحتوي علي تاريخ اكبر من تاريخ اليوم',
      inputType: 'date',
      outputType: 'single',
      validators: ['required'],
      listner: (value: string, controls) => {
        if (new Date(value).getTime() < Date.now()) {
          controls.startDay.setErrors({ error: 'ivalidStartDay' });
        } else {
          controls.startDay.setErrors(null);
        }
      }
    },
    {
      name: 'endDay',
      placeholder: 'اختر يوم نهاية المهمة ',
      label: 'يوم نهاية المهمة',
      errorMessage: 'هذا الحقل يجب ان يحتوي علي تاريخ اكبر من تاريخ البداية',
      inputType: 'date',
      outputType: 'single',
      validators: ['required'],
      listner: (value: string, controls) => {
        if (new Date(value).getTime() < new Date(controls.startDay.value).getTime()) {
          controls.endDay.setErrors({ error: 'ivalidEndDay' });
        } else {
          controls.endDay.setErrors(null);
        }
      }
    },
    {
      name: 'color',
      placeholder: 'اختر نوع المهمة',
      label: 'نوع المهمة',
      errorMessage: 'هذا الحقل اجباري',
      inputType: 'text',
      outputType: 'select',
      options: [{ key: 'red', value: 'مأمورية' }, { key: 'blue', value: 'مؤتمر' }],
      validators: ['required'],
    },
    {
      name: 'officer',
      placeholder: 'اختر منفذ المهمة',
      label: 'منفذ المهمة',
      errorMessage: 'هذا الحقل اجباري',
      inputType: 'text',
      outputType: 'select',
      options: [
        { key: '1', value: 'عميد/أحمد عبدالباقي' },
        { key: '2', value: 'عقيد/خالد عبدالرحيم' },
        { key: '1', value: 'عقيد/محمد كمال' },],
      validators: ['required'],
    },

  ];

  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];

  constructor(private service: EventsService) {
    this.service.find();
    this.eventsList$ = this.service.stateSubject;
  }

  eventClicked({ event }: { event: EventApi }) {
    this.selectedValues = this.service.state.find(el => el.id == event.id);
    this.show = true;
  }

  deleteItem(id: string | number) {
    this.show = false;
    this.service.delete(id)
      .catch(err => alert('حدث خطأ في الخادم')).finally(() => alert('تمت العملية بنجاح'));
  }

  saveForm(data: { title: string, startDay: string, endDay: string }) {
    this.show = false;
    let promise: Promise<any> = null;

    if (!this.selectedValues)
      promise = this.service.create({
        ...data,
        start: new Date(data.startDay),
        end: new Date(data.endDay),
        id: Date.now() + Math.ceil(Math.random() * 500),
      })
    else
      promise = this.service.update(this.selectedValues.id, data);

    promise.catch(err => alert('حدث خطأ في الخادم')).finally(() => alert('تمت العملية بنجاح'));
  }
}
