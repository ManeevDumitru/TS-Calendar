class Calendar {
  private readonly date: Date = new Date();
  private selectedMonth: number = 1;
  private selectedYear: number = 2020;
  private selectedDate: Date = new Date();
  private firstDayOfSelectedMonth: Date = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
  private lastDayOfSelectedMonth: Date = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);
  private readonly weekDays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  private readonly calendarBody: any = document.getElementById("calendar-body");
  private readonly headerRight: any = document.getElementById('header-right');

  public data: object = {};
  public eventsDB: object = {};
  public readonly eventsDBUrl: string = "http://localhost:3000/events";

  public currentCalendar: string = "Calendar";

  constructor() {
    console.log('test')
    this.initCalendar();
    this.getDataBase(this.eventsDBUrl).then(this.loadData)
    this.addEventListeners();
  }

  public getData(): void {
    this.selectedDate = this.date;
    this.selectedYear = this.selectedDate.getFullYear();
    this.selectedMonth = this.selectedDate.getMonth();
    this.firstDayOfSelectedMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
    this.lastDayOfSelectedMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);
  }
  public async getDataBase(url: string): Promise<any> {
    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        this.data = myJson;
        console.log(this.data)
        return myJson
      });
  }
  public loadData(): void {
    for (let key in this.data) {
      let data: string[] = [];

      // @ts-ignore
      this.data[key].forEach((event: any) => {
        data.push(`<div>${event.text}</div>`)
      })
      Calendar.addEventToDate(key, data);
    }
  }
  public initCalendar(): void {
    this.fillCalendarWeekCells();
    this.buildCalendarBody();
    this.loadData();
    const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.headerRight.innerHTML = `<div class="date-container" id="date-container">${months[this.selectedMonth]} ${this.selectedYear}</div>`;
  }
  private changeDate(action: string) {
    switch (action) {
      case "add": {
        this.date.setMonth(this.date.getMonth() + 1);
        break;
      }
      case "remove": {
        this.date.setMonth(this.date.getMonth() - 1);
        break;
      }
      default: {
        console.log("Some went wrong");
        break;
      }
    }
    this.getData();
    this.initCalendar();
    this.loadData();
  }
  private buildCalendarBody(): void {
    let displayDates: string[] = [];
    let modifiedDate: Date = this.firstDayOfSelectedMonth;
    let modifiedDate2: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    const weeksInCurrentMonth: number = Math.ceil((this.firstDayOfSelectedMonth.getDay() + this.lastDayOfSelectedMonth.getDate()) / 7);
    const amountOfDaysLeft: number = ((weeksInCurrentMonth * 7) - modifiedDate.getDay()) - this.lastDayOfSelectedMonth.getDate();

    modifiedDate2.setDate(modifiedDate2.getDate() - modifiedDate.getDay());
    for (let i: number = 0; i < modifiedDate.getDay(); i++) {
      displayDates.push(this.calendarCellTemplate(Calendar.dateFormat(modifiedDate2)))
      modifiedDate2.setDate(modifiedDate2.getDate() + 1);
    }
    modifiedDate = this.firstDayOfSelectedMonth;

    for (let day: number = 0; day < this.lastDayOfSelectedMonth.getDate(); day++) {
      displayDates.push(this.calendarCellTemplate(Calendar.dateFormat(modifiedDate)))
      modifiedDate.setDate(modifiedDate.getDate() + 1)
    }

    for (let daysLeft: number = 0; daysLeft < amountOfDaysLeft; daysLeft++) {
      displayDates.push(this.calendarCellTemplate(Calendar.dateFormat(modifiedDate)))
      modifiedDate.setDate(modifiedDate.getDate() + 1)
    }
    this.calendarBody.innerHTML = displayDates.join("")
  }
  private isNotCurrentMonth(date: string): string {
    let modifiedDate: Date = new Date(date);
    modifiedDate.setHours(0, 0, 0, 0)

    if (modifiedDate < this.firstDayOfSelectedMonth || modifiedDate > this.lastDayOfSelectedMonth) {
      return "not-current-month"
    }
    return ""
  }
  static dateFormat(date: Date): string { // Formats param date to yyyy-mm-dd
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (date) {
      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }
    }
    return [year, month, day].join('-');
  }
  private fillCalendarWeekCells(): void {
    let days: string[] = [];
    const calendarWeekContainer: any = document.getElementById('calendar-weeks-container');

    for (let day: number = 0; day < 7; day++) {
      days.push(this.calendarWeekCellTemplate(day))
    }
    calendarWeekContainer.innerHTML = days.join("");
  }
  private calendarWeekCellTemplate(index: number): string {
    return `<div class="calendar-week-cell">${this.weekDays[index]}</div>`
  }
  private calendarCellTemplate(date: string): string {
    const currentDate: Date = new Date();
    const modifiedDate: Date = new Date(date);
    const isToday: string = Calendar.dateFormat(currentDate) === Calendar.dateFormat(modifiedDate) ? 'calendar-cell-today' : 'calendar-cell';
    const isSunday: string = this.weekDays[modifiedDate.getDay()] === "Sunday" ? "#FF0000" : "#fff"; // -> Same as private function isSunday
    const isHoliday: string = date in this.data ? "holiday" : "";

    return `
      <div id="${date}" class="${isToday} ${this.isNotCurrentMonth(date)} ${isHoliday}" style="color: ${isSunday}">
      ${date}
        <div class="calendar-cell-date">${modifiedDate.getDate()}</div>
        <div class="calendar-cell-events-container"></div>
      </div>`
  }
  static closeEvent(): void {
    document.getElementById('eventDescBackground')!.style.display = "none";
  }
  static openEvent(): void {
    document.getElementById('eventDescBackground')!.style.display = "block";
  }
  private saveEvent(): void {
    const inputDate: string = (<HTMLInputElement>document.getElementById("dateInput")).value;
    const eventDesc: string = (<HTMLInputElement>document.getElementById("eventDesc")).value;
    let dateEvents: string[] = [];
    // @ts-ignore
    if (!this.eventsDB[inputDate]) {
      // @ts-ignore
      this.eventsDB[inputDate] = [];
      // @ts-ignore
      this.eventsDB[inputDate].push(eventDesc)
    } else {
      // @ts-ignore
      this.eventsDB[inputDate].push(eventDesc)
    }

    // @ts-ignore
    this.eventsDB[inputDate].forEach((item: string) => {
      dateEvents.push(`<div>${item}</div>`)
    })
    console.log('pushed')
    Calendar.addEventToDate(inputDate, dateEvents);
  }

  public changeCalendar(): void {
    this.data = {};
    this.getData();
    this.initCalendar()

  }

  static addEventToDate(date: string, events: string[]): void {
    try {
      document.getElementById(date)!.className += " holiday";
      (<HTMLElement>(<HTMLElement>document.getElementById(date)).lastElementChild).innerHTML = events.join(``);
    } catch (e) {
      //
    }
  }
  private addEventListeners(): void {
    (<HTMLElement>document.getElementById("removeMonthBtn")).addEventListener("click", () => {
      this.changeDate("remove");
    });
    (<HTMLElement>document.getElementById("addMonthBtn")).addEventListener("click", () => {
      this.changeDate("add");
    });
    (<HTMLElement>document.getElementById("addDateBtn")).addEventListener("click", () => {
      Calendar.openEvent();
    });
    (<HTMLElement>document.getElementById("confirmEvent")).addEventListener("click", () => {
      this.saveEvent();
    });
    (<HTMLElement>document.getElementById("cancelEvent")).addEventListener("click", () => {
      Calendar.closeEvent();
    });
    (<HTMLElement>document.getElementById("changeCalculatorBtn")).addEventListener("click", () => {
      this.changeCalendar();
    });
  }
}

class AnotherCalendar extends Calendar {
  private readonly localeDbUrl: string = "http://localhost:3001/events";
  constructor() {
    super();
    this.getDataBase(this.localeDbUrl).then(() => {
      console.log("Success");
      this.loadAnotherData();
    })
  }
  private loadAnotherData(): void {
    for (let key in this.data) {
      let data: string[] = [];
      // @ts-ignore
      this.data[key].forEach((event: any) => {
        data.push(`<div>${event.text}</div>`)
      })
      Calendar.addEventToDate(key, data);
    }
  }
  public changeCalendar(): void {
    this.data = {};
    this.getData();
    this.initCalendar();
    if (this.currentCalendar === "Calendar") {
      this.getDataBase(this.eventsDBUrl).then(() => {
        this.loadData();
      })
      this.currentCalendar = "anotherCalendar";
    } else {
      this.getDataBase(this.localeDbUrl).then(() => {
        this.loadData();
      })
      this.currentCalendar = "Calendar";
    }
  }
}

let calendar = new AnotherCalendar();