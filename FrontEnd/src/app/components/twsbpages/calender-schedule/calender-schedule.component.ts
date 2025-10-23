
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView, DateAdapter, } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferenceService } from '../../../shared/services/twsbservices/reference.service';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { Appointment } from '../../../models/appointment';
import { AppointmentService } from '../../../shared/services/twsbservices/appointment.service';


interface Color {
  primary: string;
  secondary: string;
}

const colors: { [key: string]: Color } = { // Add index signature
  red: {
    primary: '#ad2121',
    secondary: '#ad2121', // Or a lighter shade of red
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#1e90ff', // Or a lighter shade of blue
  },
  green: {
    primary: '#32cd32',
    secondary: '#32cd32', // Or a lighter shade of green
  },
  yellow: {
    primary: '#ffc107',
    secondary: '#ffc107', // Or a lighter shade of yellow
  },
  purple: {
    primary: '#8f44ad',
    secondary: '#8f44ad', // Or a lighter shade of purple
  },
  orange: {
    primary: '#ff8c00',
    secondary: '#ff8c00', // Or a lighter shade of orange
  },
  pink: {
    primary: '#ff69b4',
    secondary: '#ff69b4', // Or a lighter shade of pink
  },
  brown: {
    primary: '#a0522d',
    secondary: '#a0522d', // Or a lighter shade of brown
  },
  gray: {
    primary: '#808080',
    secondary: '#808080', // Or a lighter shade of gray
  },
  teal: {
    primary: '#008080',
    secondary: '#008080', // Or a lighter shade of teal
  },
  lime: {
    primary: '#90ee90',
    secondary: '#90ee90', // Or a lighter shade of lime
  },
  indigo: {
    primary: '#4b0082',
    secondary: '#4b0082', // Or a lighter shade of indigo
  },
  violet: {
    primary: '#ee82ee',
    secondary: '#ee82ee', // Or a lighter shade of violet
  },
  magenta: {
    primary: '#ff00ff',
    secondary: '#ff00ff', // Or a lighter shade of magenta
  },
  cyan: {
    primary: '#00ffff',
    secondary: '#00ffff', // Or a lighter shade of cyan
  },
};

const SingalColor = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'teal',
];

function getSingalColor(): string {
  const randomIndex = Math.floor(Math.random() * colorNames.length);
  return SingalColor[randomIndex];
}


const colorNames = Object.keys(colors);

@Component({
  selector: 'app-calender-schedule',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './calender-schedule.component.html',
  styleUrl: './calender-schedule.component.scss'
})
export class CalenderScheduleComponent {


  appointments: any;
  appointment = new Appointment();
  vehicleMakes: any[] = [];
  vehicleModels: any[] = [];
  showLoader: boolean = false;
  @ViewChild('modalAddCourtesyCarsPopUp') modalAddCourtesyCarsPopUp: TemplateRef<any> | undefined;

  constructor(private modal: NgbModal,
    private referenceService: ReferenceService,
    private toaster: DisplaymessageComponent,
    private appointmentService: AppointmentService
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit() {
    this.getVehicleMakes();
    this.GetAllAppointments();
  }

  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  appointmentBookings: any;
  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalAddCourtesyCarsPopUp, { size: 'lg' });

    this.appointment = event.meta;
    this.getVehicleModelsByMakeId();
    //this.appointment = event.meta;

  }
  newEvent!: CalendarEvent;
  addEvent(): void {
    this.newEvent = {
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors['red'],
      draggable: true,
      actions: this.actions,
      cssClass: 'primary',
    };
    this.events.push(this.newEvent);

    this.handleEvent('Add new event', this.newEvent);
    this.refresh.next(true);
  }

  eventDropped({
    event,
    newStart,
    newEnd,
    allDay,
  }: CalendarEventTimesChangedEvent): void {
    const externalIndex = this.events.indexOf(event);
    if (typeof allDay !== 'undefined') {
      event.allDay = allDay;
    }
    if (externalIndex > -1) {
      this.events.splice(externalIndex, 1);
      this.events.push(event);
    }
    event.start = newStart;
    if (newEnd) {
      event.end = newEnd;
    }
    if (this.view === 'month') {
      this.viewDate = newStart;
      this.activeDayIsOpen = true;
    }
    this.events = [...this.events];
  }

  externalDrop(event: CalendarEvent) {
    if (this.events.indexOf(event) === -1) {
      this.events = this.events.filter((iEvent) => iEvent !== event);
      this.events.push(event);
    }
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openCreateBookingPopUp() {
    this.modal.open(this.modalAddCourtesyCarsPopUp, { backdrop: 'static', size: 'lg' });
    this.appointment = new Appointment();
  }

  getVehicleMakes() {
    this.referenceService.GetAllmake().subscribe({
      next: (data) => {
        this.vehicleMakes = data.body;

      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', 'Failed to get references');
      },
      complete: () => {
      }
    });
  }

  GetAllAppointments() {
    this.appointmentService.GetAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data.body.data;
        //this.events = data.body.data;

        //this.booking.
        const bookings = [];
        for (const item of data.body.data) {
          const booking: CalendarEvent =
          {
            start: startOfDay(new Date(item.scheduledBookInDate)),
            end: new Date(item.scheduledBookInDate),
            title: item.title+' ('+item.vehicleRegistration+')',
            color: getRandomColor(),
            actions: this.actions,
            allDay: false,
            draggable: true,
            cssClass: getSingalColor(),
            meta: item,
          }
          bookings.push(booking)
        }
        this.events = bookings;
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', 'Failed to get appointment');
      },
      complete: () => {
      }
    });
  }


  getVehicleModelsByMakeId() {
    const makeId = this.appointment.vehicleMakeId
    this.referenceService.GetAllModelsByMakeId(makeId).subscribe({
      next: (data) => {
        this.vehicleModels = data.body;
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', 'Failed to get references');
      },
      complete: () => {
      }
    });
  }

  bookAppointment() {
    if (this.appointment.vehicleMakeId == undefined || this.appointment.vehicleMakeId == null || this.appointment.vehicleMakeId == 0) {
      this.toaster.displayErrorMessage('NMO', 'Please select a vehicle make');
      return;
    }

    if (this.appointment.vehicleModelId == undefined || this.appointment.vehicleModelId == null || this.appointment.vehicleModelId == 0) {
      this.toaster.displayErrorMessage('NMO', 'Please select a vehicle model');
      return;
    }

    if (this.appointment.customerName == undefined || this.appointment.customerName == null || this.appointment.customerName == "") {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    if (this.appointment.customerMobile == undefined || this.appointment.customerMobile == null || this.appointment.customerMobile == "") {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    if (this.appointment.customerEmail == undefined || this.appointment.customerEmail == null || this.appointment.customerEmail == "") {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    if (this.appointment.vehicleRegistration == undefined || this.appointment.vehicleRegistration == null || this.appointment.vehicleRegistration == "") {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    if (this.appointment.scheduledBookInDate == undefined || this.appointment.scheduledBookInDate == null) {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    this.showLoader = true;
    this.appointmentService.BookAppointment(this.appointment).subscribe({
      next: (data) => {
        this.toaster.displaySuccessMessage('NMO', data.body.message);
        this.appointment = new Appointment();
        this.CloseAppointmentPopUp();
        this.GetAllAppointments();
      },
      error: (error) => {
        //this.actionInProgress = false;
        this.toaster.displayErrorMessage('NMO', 'Failed to Save Booking Schedule');
        this.showLoader = false;
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  UpdateBookAppointment() {
    if (this.appointment.vehicleMakeId == undefined || this.appointment.vehicleMakeId == null || this.appointment.vehicleMakeId == 0) {
      this.toaster.displayErrorMessage('NMO', 'Please select a vehicle make');
      return;
    }

    if (this.appointment.vehicleModelId == undefined || this.appointment.vehicleModelId == null || this.appointment.vehicleModelId == 0) {
      this.toaster.displayErrorMessage('NMO', 'Please select a vehicle model');
      return;
    }

    if (this.appointment.customerName == undefined || this.appointment.customerName == null || this.appointment.customerName == "") {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    if (this.appointment.customerMobile == undefined || this.appointment.customerMobile == null || this.appointment.customerMobile == "") {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    if (this.appointment.customerEmail == undefined || this.appointment.customerEmail == null || this.appointment.customerEmail == "") {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    if (this.appointment.vehicleRegistration == undefined || this.appointment.vehicleRegistration == null || this.appointment.vehicleRegistration == "") {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    if (this.appointment.scheduledBookInDate == undefined || this.appointment.scheduledBookInDate == null) {
      this.toaster.displayErrorMessage('NMO', 'Please enter customer name');
      return;
    }

    this.showLoader = true;
    this.appointmentService.UpdateBookAppointment(this.appointment).subscribe({
      next: (data) => {
        this.toaster.displaySuccessMessage('NMO', data.body.message);
        this.appointment = new Appointment();
        this.CloseAppointmentPopUp();
        this.GetAllAppointments();
      },
      error: (error) => {
        //this.actionInProgress = false;
        this.toaster.displayErrorMessage('NMO', 'Failed to Update Booking Schedule');
        this.showLoader = false;
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  EditBooking (item: any) {
    this.modal.open(this.modalAddCourtesyCarsPopUp, { size: 'lg' });

    this.appointment = item;
    this.getVehicleModelsByMakeId();
  }

  CloseAppointmentPopUp() {
    this.modal.dismissAll();
  }

  
  getRandomColor(): Color { // Return type is now Color
    const randomIndex = Math.floor(Math.random() * colorNames.length);
    const randomColorName = colorNames[randomIndex];
    return colors[randomColorName]; // No error now!
  }

}

function getRandomColor(): Color { // Return type is now Color
  const randomIndex = Math.floor(Math.random() * colorNames.length);
  const randomColorName = colorNames[randomIndex];
  return colors[randomColorName]; // No error now!
}