import { Directive, ElementRef, inject, input, OnChanges, Renderer2 } from '@angular/core';
import { CommonHelper } from '../utils/common-helper';

@Directive({ selector: '[appCurrency]' })
export class CurrencyDirective implements OnChanges {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer = inject(Renderer2);

  readonly amount = input(0);
  readonly symbol = input('');
  readonly forceShowDecimalPlaces = input(false);

  private readonly localeDecimalsSeparator = CommonHelper.getLocaleDecimalSeparator();
  private amountRoundedTo2Decimals = '0.00';

  ngOnChanges(): void {
    const amount = Number.isFinite(this.amount()) ? this.amount() : 0;

    this.amountRoundedTo2Decimals = amount.toFixed(2);
    const indexOfDecimalSeparator = this.amountRoundedTo2Decimals.lastIndexOf('.');
    const integerPart = Number(
      this.amountRoundedTo2Decimals.substring(0, indexOfDecimalSeparator),
    ).toLocaleString(); //toLocaleString applies rounding, do only to integer part.

    this.clearHost();
    this.renderer.appendChild(
      this.el.nativeElement,
      this.renderer.createText(`${this.symbol()}${integerPart}`),
    );

    if (this.showDecimalPlaces()) {
      const decimalPart = this.amountRoundedTo2Decimals.substring(indexOfDecimalSeparator + 1);
      const decimalElement = this.renderer.createElement('span') as HTMLSpanElement;

      this.renderer.addClass(decimalElement, 'decimal');
      this.renderer.setProperty(
        decimalElement,
        'textContent',
        `${this.localeDecimalsSeparator}${decimalPart}`,
      );
      this.renderer.appendChild(this.el.nativeElement, decimalElement);
    }
  }

  private clearHost(): void {
    const host = this.el.nativeElement;

    while (host.firstChild) {
      this.renderer.removeChild(host, host.firstChild);
    }
  }

  private showDecimalPlaces(): boolean {
    return this.forceShowDecimalPlaces() || !Number.isInteger(+this.amountRoundedTo2Decimals);
  }
}
