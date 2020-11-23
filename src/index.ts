//TODO
//1. Interface
//2. Incapsulation
//3. Back
import {log} from "util";

export class Calculator {
  // @ts-ignore
  protected outputInput: HTMLInputElement | null = document.getElementById('output-input');
  // @ts-ignore
  protected historyInput: HTMLInputElement | null = document.getElementById('history-input');
  protected history: string[] = [];
  protected edited: boolean = false;
  protected currentValue: string = "0";
  protected operator: string = "";
  protected prevOperator: string = "";
  protected hiddenOutput: string = "";
  protected reset: boolean = false;

  constructor() {
    this.writeIn(this.currentValue);
  }
  protected writeIn(value: string): void {
    if (this.reset) {
      this.resetParams();
      this.reset = false;
    }
    if (+value >= 0) {
      if (this.edited) {
        this.currentValue = "0";
        this.outputInput!.value = "0";
        this.edited = false;
      }
      if (this.currentValue === "0") {
        if (!(value === ".")) {
          this.currentValue = value;
        } else {
          this.currentValue = "0.";
        }
      } else {
        this.currentValue += value;
      }
      this.outputInput!.value = this.currentValue;
    } else if (value === ".") {
      if (value === ".") {
        if (!(this.currentValue.includes("."))) {
          this.currentValue += ".";
        }
      }
      this.outputInput!.value = this.currentValue;
    } else {
      this.setOperation(value);
    }
  }
  private setOperation(value: string): void {
    const complexOperators: string[] = ["1/x", "x²", "√x", "%"];
    this.operator = value;
    console.log(`Prev is 1/x ${this.prevOperator === value}`)
    if(!this.edited) {
      if (!(complexOperators.includes(value))) {
        if (complexOperators.includes(this.prevOperator)) {
          console.log(`Prev op was complex ${this.prevOperator}`);
          this.currentValue = "";
          this.history.push(`${value} `);
        } else {
          this.hiddenOutput = "";
          this.history.push(`${this.currentValue} ${value} `);
        }
        this.edited = true;
      } else {
        this.setComplexOperation(value);
        return
      }
    } else {
      this.history[this.history.length - 1] = `${this.currentValue} ${value} `.replace("x","");
    }
    this.historyInput!.value = this.history.join("").split("**").join("^");
    if (value === "=") {
      this.performCalculation();
      this.reset = true;
    }
    console.log(this.history);
    this.prevOperator = value;
  }
  private setComplexOperation(value: string): void {
    switch (value) {
      case "1/x":
        console.log("Is x²")
        if (this.currentValue === "0") {
          console.log('Error');
          return
        }
        if (!this.hiddenOutput) {
          this.hiddenOutput = `1/(${this.currentValue}) `;
          this.history.push(`${this.hiddenOutput} `);
        } else {
          this.history[this.history.length - 1] = `${this.hiddenOutput} `;
          this.hiddenOutput = `1/(${this.hiddenOutput}) `;
        }
        break;
      case "x²":
        console.log("Is x²")
        if (!this.hiddenOutput) {
          this.hiddenOutput = `(${this.currentValue} ** 2) `;
          this.history.push(`${this.hiddenOutput} `);
        } else {
          this.history[this.history.length - 1] = `${this.hiddenOutput} `;
          this.hiddenOutput = `(${this.hiddenOutput} ** 2) `;
        }
        break;
      case "√x":
        console.log("Is √x")
        if (!this.hiddenOutput) {
          this.hiddenOutput = `√(${this.currentValue}) `;
          this.history.push(`${this.hiddenOutput} `);
        } else {
          this.history[this.history.length - 1] = `${this.hiddenOutput} `;
          this.hiddenOutput = `√(${this.hiddenOutput}) `;
        }
        break;
    }
    this.performCalculation();
    this.prevOperator = value;
    this.historyInput!.value = this.history.join("").split("**").join("^").split("√").join("Math.sqrt");
    console.log(this.history);
  }
  private performCalculation(): void {
    let temp = this.history.join("");
    temp = temp.substring(0, temp.length - 2).split("√").join("Math.sqrt");
    if (!(eval(temp) % 2 === 0)) {
      this.outputInput!.value = eval(temp).toFixed(2).toString();
    } else {
      this.outputInput!.value = eval(temp).toString();
    }
  }
  private resetParams(): void {
    this.history = [];
    this.edited = false;
    this.currentValue = "0";
    this.operator = "";
    this.hiddenOutput = "";
    this.prevOperator = "";
    this.historyInput!.value = "";
  }
  protected clearCalculator(): void {
    this.history = [];
    this.currentValue = "0";
    this.outputInput!.value = "0";
    this.historyInput!.value = "";
  }
  protected clearCurrent(): void {
    this.currentValue = "0";
    this.outputInput!.value = "0";
  }
  protected removeOneDigit(): void {
    this.currentValue = this.currentValue.substring(0, this.currentValue.length - 1);
    if (+this.currentValue <= 0) {
      this.currentValue = "0"
    }
    this.outputInput!.value = this.currentValue;
  }
}