//TODO
//1. Interface
//2. Incapsulation
//3. Back

export class Calculator {
  // @ts-ignore
  protected outputInput: HTMLInputElement | null = document.getElementById('output-input');
  // @ts-ignore
  protected historyInput: HTMLInputElement | null = document.getElementById('history-input');
  protected currentValue: string = "0";
  protected operator: string = ""
  constructor() {
    this.writeIn(this.currentValue)
  }
  protected writeIn(value: string): void {
    if (this.currentValue === "0" && +value >= 0) {
      if (!(value === ".")) {
        this.currentValue = value;
      } else {
        this.currentValue = "0.";
      }
    } else if (+value >= 0) {
      this.currentValue += value;
    } else if (value === ".") {
      if (value === ".") {
        if (!(this.currentValue.includes("."))) {
          this.currentValue += ".";
        }
      }
    } else {
      this.performCalculation(value);
    }
    this.outputInput!.value = this.currentValue;
  }
  protected addToHistory(value: string): void {
    this.historyInput!.value += value;
  }
  protected performCalculation(value: string): void {
    switch (value) {
      case `1\nx`:
        this.addToHistory(`1/(${this.currentValue})`);
        break;
    }
    this.operator = value;
    console.log(this.operator);
  }
}