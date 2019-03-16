import { Component, Input } from '@angular/core';
import { CommonHelper } from 'src/app/shared/helpers/common-helper';

@Component({
  selector: 'app-currency-display',
  templateUrl: './currency-display.component.html',
  styleUrls: ['./currency-display.component.scss']
})
export class CurrencyDisplayComponent {

  @Input() amount: number;
  @Input() symbol: string;

  constructor() { }
  
  getDigitsInfo(): string {
    return CommonHelper.getCurrencyPipeDigitsInfo(this.amount);
  }

}
