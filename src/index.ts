//TODO
//1. Interface
//2. Incapsulation
//3. Back
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
  protected addToHistory(value: string, type: string): void {
    if (type === 'add') {
      this.historyInput!.value += value;
    } else if (type === 'equal') {
      this.historyInput!.value = value;
    }
  }
  // protected setOperation(value: string): void {
  //   switch (value) {
  //     case `1/X`:
  //       if (!this.hiddenOutput) { // if hidden is empty
  //         this.hiddenOutput = `1/(${this.currentValue})`; // curr val
  //         this.addToHistory(this.hiddenOutput, 'equal');
  //       } else {
  //         if (!(this.prevOperator === `1/X`)) { // if before was the same op
  //           this.hiddenOutput = `1/(${this.hiddenOutput})`; // hidden val
  //           this.addToHistory(this.hiddenOutput, 'add');
  //         } else {
  //           console.log(this.hiddenOutput)
  //           this.hiddenOutput = `1/(${this.hiddenOutput})`; // hidden val
  //           this.addToHistory(this.hiddenOutput, 'equal');
  //         }
  //       }
  //       this.performCalculation(this.hiddenOutput);
  //
  //       break;
  //     case `X²`:
  //       console.log(`WIP`)
  //       // if (!this.hiddenOutput) {
  //       //   this.hiddenOutput = `sqr(${this.currentValue})`;
  //       //   this.addToHistory(this.hiddenOutput, 'equal');
  //       // } else {
  //       //   if (!(this.prevOperator === `X²`)) {
  //       //     this.hiddenOutput = `sqr(${this.hiddenOutput})`
  //       //     this.addToHistory(this.hiddenOutput, 'equal');
  //       //   } else {
  //       //     this.hiddenOutput = `sqr(${this.hiddenOutput})`
  //       //     this.addToHistory(this.hiddenOutput, 'equal');
  //       //   }
  //       // }
  //       // this.prevOperator = value;
  //       break;
  //     case `√x`:
  //       if (!this.hiddenOutput) {
  //         this.hiddenOutput = `√(${this.currentValue})`;
  //         this.addToHistory(this.hiddenOutput, 'equal');
  //       } else {
  //         if (!(this.prevOperator === `√x`)) {
  //           this.hiddenOutput = `√(${this.hiddenOutput})`
  //           this.addToHistory(this.hiddenOutput, 'add');
  //         } else {
  //           this.hiddenOutput = `√(${this.hiddenOutput})`
  //           this.addToHistory(this.hiddenOutput, 'equal');
  //         }
  //       }
  //       this.prevOperator = value;
  //       break;
  //     case `=`:
  //       let tempString: string = this.historyInput!.value;
  //       if (!(this.prevOperator === "=")) {
  //         console.log(tempString);
  //         tempString = tempString.replace('√', 'Math.sqrt');
  //         console.log(eval(tempString));
  //         this.addToHistory(`${tempString} = `, 'equal')
  //       }
  //       this.prevOperator = value;
  //       break;
  //     case `+`:
  //       this.hiddenOutput = this.currentValue;
  //       this.addToHistory(`${this.hiddenOutput}`, 'equal');
  //       this.addToHistory(` ${value} `, 'add');
  //       this.resetParams();
  //       console.log(this.hiddenOutput);
  //       break;
  //     case `R`:
  //       this.currentValue = this.currentValue.substring(0, this.currentValue.length - 1);
  //       if (+this.currentValue <= 0) {
  //         this.currentValue = "0"
  //       }
  //       this.outputInput!.value = this.currentValue;
  //       console.log(this.currentValue);
  //       break;
  //     case `C`:
  //       this.currentValue = "0";
  //       this.outputInput!.value = this.currentValue;
  //       console.log(this.currentValue);
  //       break;
  //   }
  //   this.prevOperator = value;
  //   this.operator = value;
  // }
  protected setOperation(value: string): void {
    this.operator = value;
    if(!this.edited) {
      this.history.push(`${this.currentValue} ${value} `.replace("x",""));
      this.edited = true;
    } else {
      this.history[this.history.length - 1] = `${this.currentValue} ${value} `.replace("x","");
    }
    this.historyInput!.value = this.history.join("");
    if (value === "=") {
      let temp = this.history.join("");
      console.log(temp = temp.substring(0, temp.length - 2)
        .replace("X", "*")
        .replace("√","Math.sqrt"));
      console.log(eval(temp));
      this.outputInput!.value = eval(temp).toString();
      this.reset = true;
    }
    console.log(this.history)
    this.prevOperator = value;
  }
  private resetParams(): void {
    this.history = [];
    this.edited = false;
    this.currentValue = "0";
    this.operator = "";
    this.prevOperator = "";
    this.hiddenOutput = "";
    this.historyInput!.value = "";
  }
  public clearCalculator(): void {
    this.currentValue = "0";
    this.outputInput!.value = "0";
    this.historyInput!.value = "";
  }
  private performCalculation(value: string): void {
    console.log(eval(value));
    this.outputInput!.value = eval(value);
    this.currentValue = '0';
    this.operator = '';
  }
}