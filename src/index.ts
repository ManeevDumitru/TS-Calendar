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

  private data: any = [];
  private eventsDB: object = {};
  private readonly eventsDBUrl: string = "http://localhost:3000/events";

  constructor() {
    this.getData(this.eventsDBUrl);
    this.loadData();
    this.initCalendar();
    this.addEventListeners();
    this.uploadDataToFile();
  }

  private async loadData() {
    await this.getData(this.eventsDBUrl)
      .then(() => {
        for (let key in this.eventsDB) {
          let data: string[] = [];
          this.eventsDB[key].forEach((event: string) => {
            data.push(`<div>${event}</div>`)
          })
          Calendar.addEventToDate(key, data);
        }
      })
  }
  private uploadDataToFile(): void {
    console.log("Successfully uploaded");
  }
  private initCalendar(): void {
    const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.headerRight.innerHTML = `<div class="date-container" id="date-container">${months[this.selectedMonth]} ${this.selectedYear}</div>`;
    this.buildCalendarBody();
    this.fillCalendarWeekCells();
  }
  static addEventToDate(date: string, events: string[]): void {
    document.getElementById(date)!.lastElementChild!.innerHTML = events.join(``);
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
    this.getData(this.eventsDBUrl);
    this.initCalendar();
  }
  private async getData(url: string): Promise<any> {
    this.selectedDate = this.date;
    this.selectedYear = this.selectedDate.getFullYear();
    this.selectedMonth = this.selectedDate.getMonth();
    this.firstDayOfSelectedMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
    this.lastDayOfSelectedMonth = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0);

    await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        this.eventsDB = myJson;
        return myJson;
      });
  }
  private buildCalendarBody(): void {
    let displayDates: string[] = [];
    let modifiedDate: Date = this.firstDayOfSelectedMonth;
    let modifiedDate2: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    const weeksInCurrentMonth: number = Math.ceil((this.firstDayOfSelectedMonth.getDay() + this.lastDayOfSelectedMonth.getDate()) / 7);
    const amountOfDaysLeft: number = ((weeksInCurrentMonth * 7) - modifiedDate.getDay()) - this.lastDayOfSelectedMonth.getDate();

    modifiedDate2.setDate(modifiedDate2.getDate() - modifiedDate.getDay());
    for (let i: number = 0; i < modifiedDate.getDay(); i++) {
      displayDates.push(this.calendarCellTemplate(this.dateFormat(modifiedDate2)))
      modifiedDate2.setDate(modifiedDate2.getDate() + 1);
    }
    modifiedDate = this.firstDayOfSelectedMonth;

    for (let day: number = 0; day < this.lastDayOfSelectedMonth.getDate(); day++) {
      displayDates.push(this.calendarCellTemplate(this.dateFormat(modifiedDate)))
      modifiedDate.setDate(modifiedDate.getDate() + 1)
    }

    for (let daysLeft: number = 0; daysLeft < amountOfDaysLeft; daysLeft++) {
      displayDates.push(this.calendarCellTemplate(this.dateFormat(modifiedDate)))
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
  private dateFormat(date: Date): string { // Formats param date to yyyy-mm-dd
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
  private calendarCellTemplate(date: string): string {
    const currentDate: Date = new Date();
    const modifiedDate: Date = new Date(date);
    const isToday: string = this.dateFormat(currentDate) === this.dateFormat(modifiedDate) ? 'calendar-cell-today' : 'calendar-cell';
    const isSunday: string = this.weekDays[modifiedDate.getDay()] === "Sunday" ? "#FF0000" : "#fff"; // -> Same as private function isSunday

    return `
      <div id="${date}" class="${isToday} ${this.isNotCurrentMonth(date)}" style="color: ${isSunday}">
        <div class="calendar-cell-date">${modifiedDate.getDate()}</div>
        <div class="calendar-cell-events-container"></div>
      </div>`
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

    this.eventsDB[inputDate].forEach((item: string) => {
      dateEvents.push(`<div>${item}</div>`)
    })
    Calendar.addEventToDate(inputDate, dateEvents);
    console.log(this.eventsDB)
  }
  private addEventListeners(): void {
    document.getElementById("removeMonthBtn").addEventListener("click", () => {
      this.changeDate("remove");
    });
    document.getElementById("addMonthBtn").addEventListener("click", () => {
      this.changeDate("add");
    });
    document.getElementById("addDateBtn").addEventListener("click", () => {
      Calendar.openEvent();
    })
    document.getElementById("confirmEvent").addEventListener("click", () => {
      this.saveEvent();
    })
    document.getElementById("cancelEvent").addEventListener("click", () => {
      Calendar.closeEvent();
    })
  }
}

let calendar = new Calendar();


