

  export class CommonHelper {

    public static isEmptyObject(obj) {
      return (Object.getOwnPropertyNames(obj).length === 0);
    }

    public static getCurrencyPipeDigitsInfo(amount: number): string {
      return Number.isInteger(amount) ? "1.0" : "1.2";
    }

  };

