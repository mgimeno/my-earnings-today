

export class CommonHelper {

  public static isEmptyObject(obj) {
    return (Object.getOwnPropertyNames(obj).length === 0);
  }

  public static getCurrencyPipeDigitsInfo(amount: number): string {

    if (!amount) {
      return "1.0";
    }

    let amountRoundedTo2Decimals: string = amount.toFixed(2);

    return Number.isInteger(+amountRoundedTo2Decimals) ? "1.0" : "1.2";
  }

  public static copyToClipboard(value: string): void {

    let selBox = document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;


    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      selBox.contentEditable = "true";
      selBox.readOnly = false;
      let range = document.createRange();
      range.selectNodeContents(selBox);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      selBox.setSelectionRange(0, 999999);

      document.body.appendChild(selBox);
    } else {

      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
    }

    document.execCommand('copy');

    selBox.blur();
    document.body.removeChild(selBox);
  }

};

