import { Calculator } from "./index"

class CalculatorGeneration extends Calculator {
  private readonly numbersContainer: HTMLElement = document.getElementById("numbers-container")!;
  private readonly operationsContainer: HTMLElement = document.getElementById("operations-container")!;
  private readonly buttons: string[] = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "="];
  private readonly operations: string[] = ["+", "-", "*", "/"];
  constructor() {
    super();
    console.log("B")
    CalculatorGeneration.generateButtons(this.buttons, this.numbersContainer);
    CalculatorGeneration.generateButtons(this.operations, this.operationsContainer);
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