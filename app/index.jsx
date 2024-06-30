import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import * as React from 'react';

import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';

import DeleteModal from '../components/delete-modal';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Helper functions
async function triggerNotifications(data) {
  let stringData = '';
  // console.log(data)
  for (notifObject of data) {
    stringData += '● ' + notifObject.message + '\n';
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your Reminders For Today',
      body: stringData,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2, repeats: false },
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Your Reminders For Today',
      body: stringData,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 60 * 60 * 24, repeats: true },
  });
}

async function cancelNotifs() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Main Page
export default function App() {
  const [reminders, setReminders] = React.useState([]);
  const [reminderMessage, setReminderMessage] = React.useState('');

  const [loading, setLoading] = React.useState(true);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState('');
  const [isModalVisibile, setIsModalVisibile] = React.useState(false);

  // Initialising
  async function init() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log(
        'Permission not granted to get push token for push notification!'
      );
    }

    let reminders = await SecureStore.getItemAsync('items');
    setLoading(false);

    if (reminders == null || reminders == [] || reminders == undefined) {
      return;
    }

    reminders = JSON.parse(reminders);
    setReminders(reminders);
  }

  React.useEffect(() => {
    init();
  }, []);

  return (
    <View className='bg-[#DAF5F0]'>
      <SafeAreaView className='h-full'>
        <View className='flex flex-col h-full'>
          {/* Reminders List */}
          <ScrollView className='flex-1'>
            {loading ? (
              <></>
            ) : reminders ? (
              reminders.map((reminder, index) => {
                let colorList = ['BAFDA2', 'E3DFF2', 'FEFC96', 'F7D6B4'];
                let color = colorList[index % colorList.length];
                return (
                  <View key={reminder.id} className='mx-4 mb-3'>
                    <Shadow
                      className='rounded-xl'
                      stretch={true}
                      offset={[6, 6]}
                      distance={0}
                      startColor='#000000ff'
                    >
                      <Pressable
                        onPress={() => {
                          setIsDeleteModalVisible(true);
                          setDeleteId(reminder.id);
                        }}
                        style={{ backgroundColor: `#${color}` }}
                        className={`rounded-xl border-2 p-3 active:translate-x-1 active:translate-y-1`}
                      >
                        <Text
                          style={{ fontFamily: 'Archivo' }}
                          className='text-base'
                        >
                          {reminder.message}
                        </Text>
                      </Pressable>
                    </Shadow>
                  </View>
                );
              })
            ) : (
              <></>
            )}
          </ScrollView>

          {/* Bottom Bar */}
          <View className='absolute right-4 bottom-4 p-4'>
            <Shadow
              className='rounded-xl'
              offset={[5, 5]}
              distance={0}
              startColor='#000000ff'
            >
              <Pressable
                onPress={() => {
                  setIsModalVisibile(true);
                }}
                className='border-2 w-16 h-16 flex items-center justify-center rounded-xl bg-[#BAFDA2] fixed active:translate-x-1 active:translate-y-1'
              >
                <Text className='text-2xl'>+</Text>
              </Pressable>
            </Shadow>
          </View>

          <Modal isVisible={isModalVisibile} backdropOpacity={0.5}>
            <View className='flex items-center justify-center'>
              <Shadow
                className='rounded-xl'
                offset={[7, 7]}
                distance={0}
                startColor='#000000ff'
              >
                <View className='bg-[#DAF5F0] p-4 rounded-xl flex flex-col items-center border-4'>
                  {/* Modal Title */}
                  <Text
                    style={{ fontFamily: 'Archivo' }}
                    className='m-3 text-lg'
                  >
                    Enter your Reminder
                  </Text>

                  {/* Modal Message Input */}
                  <View className='w-52'>
                    <Shadow
                      className='rounded-2xl'
                      stretch={true}
                      offset={[4, 5]}
                      distance={0}
                      startColor='#000000ff'
                    >
                      <TextInput
                        value={reminderMessage}
                        onChangeText={(value) => {
                          setReminderMessage(value);
                        }}
                        multiline={true}
                        style={{ fontFamily: 'Archivo' }}
                        className='border-2 rounded-2xl p-3 bg-[#BAFDA2] w-full'
                      ></TextInput>
                    </Shadow>
                  </View>

                  {/* Add Button */}
                  <View className='flex flex-row my-4'>
                    <Shadow
                      className='rounded-xl mr-3'
                      offset={[4, 4]}
                      distance={0}
                      startColor='#000000ff'
                    >
                      <Pressable
                        onPress={async () => {
                          if (
                            reminderMessage == '' ||
                            reminderMessage == null ||
                            reminderMessage == undefined
                          ) {
                            return;
                          }
                          let reminders = await SecureStore.getItemAsync(
                            'items'
                          );
                          if (
                            reminders != '' &&
                            reminders != null &&
                            reminders != undefined
                          ) {
                            reminders = JSON.parse(reminders);
                          } else {
                            reminders = [];
                          }

                          reminders.push({
                            id: uid(),
                            message: reminderMessage,
                          });

                          await SecureStore.setItemAsync(
                            'items',
                            JSON.stringify(reminders)
                          );
                          setReminders(reminders);
                          setReminderMessage('');

                          await cancelNotifs();
                          await triggerNotifications(reminders);

                          setIsModalVisibile(false);
                        }}
                        className='border-2 rounded-xl p-3 bg-[#BAFDA2] active:translate-x-1 active:translate-y-1'
                      >
                        <Text>Done</Text>
                      </Pressable>
                    </Shadow>

                    {/* Cancel Button */}
                    <Shadow
                      className='rounded-xl'
                      offset={[4, 4]}
                      distance={0}
                      startColor='#000000ff'
                    >
                      <Pressable
                        onPress={() => {
                          setIsModalVisibile(false);
                        }}
                        className='border-2 rounded-xl p-3 bg-[#BAFDA2] active:translate-x-1 active:translate-y-1'
                      >
                        <Text>Cancel</Text>
                      </Pressable>
                    </Shadow>
                  </View>
                </View>
              </Shadow>
            </View>
          </Modal>
          <DeleteModal
            isModalVisibile={isDeleteModalVisible}
            setIsModalVisibile={setIsDeleteModalVisible}
            setReminders={setReminders}
            cancelNotifs={cancelNotifs}
            triggerNotifications={triggerNotifications}
            id={deleteId}
          ></DeleteModal>
        </View>
      </SafeAreaView>
    </View>
  );
}
