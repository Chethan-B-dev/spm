// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  managerUrl: "http://localhost:8080/api/manager",
  employeeUrl: "http://localhost:8080/api/employee",
  adminUrl: "http://localhost:8080/api/admin",
  sharedUrl: "http://localhost:8080/api/shared",
  authUrl: "http://localhost:8080/api/auth",
  loginUrl: "http://localhost:8080/api/login",
  firebaseConfig: {
    apiKey: "AIzaSyATkbBKvnu-VMUTxfh78LG0lpzruw5QDiw",
    authDomain: "spm-mce.firebaseapp.com",
    projectId: "spm-mce",
    storageBucket: "spm-mce.appspot.com",
    messagingSenderId: "754038086569",
    appId: "1:754038086569:web:dfb55773c221b7981182b8",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
