//TODO
//1. Interface
//2. Incapsulation
//3. Back

export class Calculator {
    // @ts-ignore
    public outputInput: HTMLInputElement | null = document.getElementById('output-input');
    constructor() {

    }
    protected performCalculation(): void {
        console.log(this.outputInput!.value)
        console.log(eval(this.outputInput!.value))
    }
}