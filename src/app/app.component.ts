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
      placeholder: 'اختر يوم المهمة ',
      label: 'يوم المهمة',
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
      name: 'startHour',
      placeholder: 'اختر ساعة المهمة ',
      label: 'توقيت المهمة بالساعات',
      errorMessage: 'هذا الحقل اجباري',
      inputType: 'time',
      outputType: 'single',
      validators: ['required'],
    },
    {
      name: 'color',
      placeholder: 'اختر نوع المهمة',
      label: 'نوع المهمة',
      errorMessage: 'هذا الحقل اجباري',
      inputType: 'text',
      outputType: 'select',
      options: [{key: 'red', value: 'مأمورية'}, {key: 'blue', value: 'مؤتمر'}],
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

  saveForm(data: { title: string, startDay: string, startHour: string }) {
    this.show = false;
    let promise: Promise<any> = null;

    if (!this.selectedValues)
      promise = this.service.create({
        ...data,
        start: new Date(data.startDay + ' ' + data.startHour),
        id: Date.now() + Math.ceil(Math.random() * 500),
      })
    else
      promise = this.service.update(this.selectedValues.id, data);

    promise.catch(err => alert('حدث خطأ في الخادم')).finally(() => alert('تمت العملية بنجاح'));
  }
}
