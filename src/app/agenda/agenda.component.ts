import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MgtAgenda, TemplateHelper } from '@microsoft/mgt';
import { RelatedDataComponent } from '../shared/related-data.component';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class CalendarComponent extends RelatedDataComponent implements OnInit {
  startDateTime = new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000));
  endDateTime = new Date(this.startDateTime.getTime() + (7 * 24 * 60 * 60 * 1000));

  @ViewChild('agenda', {static: false})
  agendaElement: ElementRef<MgtAgenda> = {} as ElementRef<MgtAgenda>;
  
  ngOnInit() {
    // Changing binding syntax in mgt-agenda template to avoid build issues with Angular
    TemplateHelper.setBindingSyntax('[[',']]');
  }

  ngAfterViewInit() {
    this.agendaElement.nativeElement.templateContext = {
      openWebLink: (e: any, context: { event: { webLink: string | undefined; }; }, root: any) => {
          window.open(context.event.webLink, '_blank');
      },
      dayFromDateTime: (dateTimeString: string) => {
        let date = new Date(dateTimeString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        let monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        let monthIndex = date.getMonth();
        let day = date.getDate();
        let year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + day + ' ' + year;
    },

    timeRangeFromEvent: (event: any) => {
        if (event.isAllDay) {
            return 'ALL DAY';
        }

        let prettyPrintTimeFromDateTime = (date: Date) => {
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            let minutesStr = minutes < 10 ? '0' + minutes : minutes;
            return hours + ':' + minutesStr + ' ' + ampm;
        };

        let start = prettyPrintTimeFromDateTime(new Date(event.start.dateTime));
        let end = prettyPrintTimeFromDateTime(new Date(event.end.dateTime));

        return start + ' - ' + end;
    }
    };
  }

  override async search(query: string) {
    
  }

}