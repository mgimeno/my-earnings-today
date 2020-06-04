export class TranslationHelper {

  public static translateDayOfTheWeek(dayNumber: number): string {

    // This is needed because
    // Angular does not provide any mechanism to generate dynamic translations as they are generated at compile time.
    let result = "";

    switch (dayNumber) {
      case 0:
        result = $localize`:@@Sunday:Sunday`;
        break;
      case 1:
        result = $localize`:@@Monday:Monday`;
        break;
      case 2:
        result = $localize`:@@Tuesday:Tuesday`;
        break;
      case 3:
        result = $localize`:@@Wednesday:Wednesday`;
        break;
      case 4:
        result = $localize`:@@Thursday:Thursday`;
        break;
      case 5:
        result = $localize`:@@Friday:Friday`;
        break;
      case 6:
        result = $localize`:@@Saturday:Saturday`;
        break;

    }

    return result;

  }

};

