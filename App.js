import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Button, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

//The notification can show, when the app is running foreground not only background
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true
    }
  }
});

export default function App() {

  //It is added for ios, asking permission. For android we dont need it.
  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS).then(
      statusObj => {
        if (statusObj.status !== 'granted') {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      }
    ).then(statusObj => {
      if (statusObj.status !== 'granted') {
        return;
      }
    });
  }, []);

  useEffect(() => {

    //When app is not running
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log(response);
      }
    );

    //We can get it, if the app is running.!!!
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log(notification);
      }
    );

    //clean up function
    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };

  }, []);

  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My first local notification',
        body: 'This is the first local notification we are sending!',
        data: { mySpecialData: 'Some text' }
      },
      trigger: {
        seconds: 10
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Trigger Notification"
        onPress={triggerNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
