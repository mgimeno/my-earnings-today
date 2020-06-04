// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appTitle: "My Earnings Today",
  appDescription: "Calculate how much you have already earned today and compare with others",
  logoUrl: "http://www.myearningstoday.com/assets/images/logo.png",
  localStoragePrefix: "my-earnings-today_dev_",
  compareToolMaxPersons: 5,
  creatorProfileLink: "https://www.linkedin.com/in/marcosgimeno/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
