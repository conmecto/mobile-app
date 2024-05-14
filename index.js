/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import { saveToken } from './src/utils/helpers';
import environments from './src/utils/environments';

PushNotification.configure({
  onRegister: function (token) {
    saveToken('deviceToken', token.token).then().catch((error) => {
      if (environments.appEnv !== 'prod') {
        console.log('Save device token error: ', error)
      }
    })
  },

  // onNotification: function (notification) {
  //   console.log("NOTIFICATION:", notification);

  //   notification.finish(PushNotificationIOS.FetchResult.NoData);
  // },

  // // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  // onAction: function (notification) {
  //   console.log("ACTION:", notification.action);
  //   console.log("NOTIFICATION:", notification);

  //   // process the action
  // },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    if (environments.appEnv !== 'prod') {
      console.error('On registration error apns', err.message, err);
    }
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);
