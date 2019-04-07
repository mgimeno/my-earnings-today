import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appCurrency]'
})
export class CurrencyDirective implements OnChanges {

  @Input() amount: number;
  @Input() symbol: string;

  amountRoundedTo2Decimals: string = null;

  constructor(private el: ElementRef) { }

  ngOnChanges() {

    if (!this.amount) {
      this.amount = 0;
    }

    this.amountRoundedTo2Decimals = this.amount.toFixed(2);

    //TODO this won't work with spanish lang. separator is "," . toLocaleString might do the trick (depends on browser, not currency
      //which prob is best)
    let indexOfDecimalSeparator = this.amountRoundedTo2Decimals.indexOf(".");
    let integerPart = Number(this.amountRoundedTo2Decimals.substring(0, indexOfDecimalSeparator)).toLocaleString();

    if (this.showDecimalPlaces()) {
      
      let decimalPart = this.amountRoundedTo2Decimals.substring(indexOfDecimalSeparator + 1);

      this.el.nativeElement.innerHTML = `${this.symbol}${integerPart}<span class='decimal'>.${decimalPart}</span>`;
    }
    else {
      this.el.nativeElement.innerHTML = `${this.symbol}${integerPart}`;
    }
  }

  showDecimalPlaces(): boolean {
    return Number.isInteger(+this.amountRoundedTo2Decimals) ? false : true;
  }
}
