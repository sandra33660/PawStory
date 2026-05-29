import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleReminderNotification = async (reminder) => {
  if (!reminder.due_date) return null;
  
  const date = new Date(reminder.due_date);
  date.setHours(9, 0, 0, 0); // Notif à 9h le jour J
  
  if (date <= new Date()) return null; // Date passée
  
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🐾 Rappel santé`,
      body: reminder.title,
      sound: true,
    },
    trigger: { date },
  });
  
  return id;
};

export const cancelNotification = async (notificationId) => {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
};
