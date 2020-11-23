import { Calculator } from "./index"

class CalculatorGeneration extends Calculator {
  private readonly operationsTContainer: HTMLElement = document.getElementById("top-operations-container")!;
  private readonly numbersContainer: HTMLElement = document.getElementById("numbers-container")!;
  private readonly operationsContainer: HTMLElement = document.getElementById("operations-container")!;
  private readonly buttons: string[] = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "±", "0", "."];
  private readonly operationsRight: string[] = ["*", "-", "+", "="];
  constructor() {
    super();
    CalculatorGeneration.generateButtons(this.buttons, this.numbersContainer);
    CalculatorGeneration.generateButtons(this.operationsRight, this.operationsContainer);
    this.addEventListeners();
  }

  static generateButtons(arr: string[], location: HTMLElement) : void {
    let temp: string[] = [];
    arr.forEach((item) => {
      temp.push(`<div><button>${item}</button></div>`)
    })
    location.innerHTML = temp.join(``)
  }

  private addEventListeners(): void {
    document.getElementById('buttons-container')!.addEventListener("click", (e) => {
      // if ((<HTMLInputElement>e.target).innerText === "0") {
      //   this.writeIn("0");
      // } else if (+(<HTMLInputElement>e.target).innerText >= 1) {
      //   this.writeIn((<HTMLInputElement>e.target).innerText);
      // } else if ((<HTMLInputElement>e.target).innerText === ".") {
      //   if (!(this.outputInput!.value).includes(".")) {
      //     this.writeIn(".");
      //   }
      // } else {
      //   this.performCalculation();
      // }
      // @ts-ignore
      this.writeIn((<HTMLInputElement>e.target).innerText, this.outputInput)
    });
    document.getElementById('c-btn')!.addEventListener('click', () => {
      this.clearCalculator();
    });
    document.getElementById('ce-btn')!.addEventListener('click', () => {
      this.clearCurrent();
    });
    document.getElementById('r-btn')!.addEventListener('click', () => {
      this.removeOneDigit();
    })
  }
}

let calculator = new CalculatorGeneration();