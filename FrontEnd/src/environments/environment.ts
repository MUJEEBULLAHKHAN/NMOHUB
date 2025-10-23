// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: true,
//   APIUrl: 'https://www.twsb-api-az-live.co.za/',
//   baseAPIUrl: 'https://www.twsb-api-az-live.co.za/api/',
//   frontEndUrlAudatexTokenPostBack: 'www.my-workshop.co.za/jobupload',
//   audatexOAuthUrl:'https://www.twsb.co.za/auda/generate_token.php',
//   firebase:{
//     apiKey: "***********************************************",
//     authDomain: "***********************************************",
//     projectId: "***********************************************",
//     storageBucket: "***********************************************",
//     messagingSenderId: "***********************************************",
//     appId: "***********************************************",
//     measurementId: "***********************************************",

//   },
// };

export const environment = {
  production: false,
  APIUrl: 'https://localhost:44382/',
  baseAPIUrl: 'https://localhost:44382/api/',
  frontEndUrlAudatexTokenPostBack: '',
  audatexOAuthUrl:'',
  firebase:{
    apiKey: "***********************************************",
    authDomain: "***********************************************",
    projectId: "***********************************************",
    storageBucket: "***********************************************",
    messagingSenderId: "***********************************************",
    appId: "***********************************************",
    measurementId: "***********************************************",

  },
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

