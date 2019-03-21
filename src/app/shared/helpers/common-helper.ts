

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
  
};

