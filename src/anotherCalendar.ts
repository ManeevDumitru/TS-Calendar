import { Calculator } from "./index"

class CalculatorGeneration extends Calculator {
  // @ts-ignore
  private outputInput: HTMLInputElement | null = document.getElementById('output-input');
  constructor() {
    super();
    console.log("B")
    CalculatorGeneration.initCalendar();
    this.addEventListeners();
}
  static initCalendar(): void {
    let buttons: string[] = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "="];
    let temp: string[] = [];
    const numbersContainer = document.getElementById("numbers-container")!;
    buttons.forEach(item => {
      temp.push(`<div><button>${item}</button></div>`)
    })
    numbersContainer.innerHTML = temp.join(``)
  }
  private addEventListeners(): void {
    document.getElementById('numbers-container')!.addEventListener("click", (e) => {
      if (+(<HTMLInputElement>e.target).innerText >= 0) {
        this.outputInput!.value += (<HTMLInputElement>e.target).innerText;
      } else if ((<HTMLInputElement>e.target).innerText === ".") {
        if (!(this.outputInput!.value).includes(".")) {
          this.outputInput!.value += ".";
        }
      } else {
        this.performCalculation();
      }
    })
  }
}

let calculator = new CalculatorGeneration();

let a: number = 1;