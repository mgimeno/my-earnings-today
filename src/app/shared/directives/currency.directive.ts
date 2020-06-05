import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { CommonHelper } from '../helpers/common-helper';

@Directive({
  selector: '[appCurrency]'
})
export class CurrencyDirective implements OnChanges {

  @Input() amount: number;
  @Input() symbol: string;
  @Input() forceShowDecimalPlaces: boolean = false;

  amountRoundedTo2Decimals: string = null;

  private readonly localeDecimalsSeparator = CommonHelper.getLocaleDecimalSeparator();


  constructor(private el: ElementRef) { }

  ngOnChanges() {

    if (!this.amount) {
      this.amount = 0;
    }

    this.amountRoundedTo2Decimals = this.amount.toFixed(2);
    const indexOfDecimalSeparator = this.amountRoundedTo2Decimals.lastIndexOf('.');
    const integerPart = Number(this.amountRoundedTo2Decimals.substring(0, indexOfDecimalSeparator)).toLocaleString(); //toLocaleString applies rounding, do only to integer part.

    if (this.showDecimalPlaces()) {

      let decimalPart = this.amountRoundedTo2Decimals.substring(indexOfDecimalSeparator + 1);

      this.el.nativeElement.innerHTML = `${this.symbol}${integerPart}<span class='decimal'>${this.localeDecimalsSeparator}${decimalPart}</span>`;
    }
    else {
      this.el.nativeElement.innerHTML = `${this.symbol}${integerPart}`;
    }
  }

  showDecimalPlaces(): boolean {
    return (this.amountRoundedTo2Decimals !== "0.00") && (this.forceShowDecimalPlaces || !Number.isInteger(+this.amountRoundedTo2Decimals)) ? true : false;
  }
}
