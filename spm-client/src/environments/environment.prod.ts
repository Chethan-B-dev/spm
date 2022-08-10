import { host } from "./environment";

export const environment = {
  production: true,
  managerUrl: `${host}/api/manager`,
  employeeUrl: `${host}/api/employee`,
  adminUrl: `${host}/api/admin`,
  sharedUrl: `${host}/api/shared`,
  authUrl: `${host}/api/auth`,
  loginUrl: `${host}/api/login`,
  firebaseConfig: {
    apiKey: "AIzaSyATkbBKvnu-VMUTxfh78LG0lpzruw5QDiw",
    authDomain: "spm-mce.firebaseapp.com",
    projectId: "spm-mce",
    storageBucket: "spm-mce.appspot.com",
    messagingSenderId: "754038086569",
    appId: "1:754038086569:web:dfb55773c221b7981182b8",
  },
};
