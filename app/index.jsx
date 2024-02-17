import { Text, View, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import * as React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';

import * as SecureStore from 'expo-secure-store';
import * as Notifications from "expo-notifications";

import AddModal from '../components/add-modal';
import DeleteModal from '../components/delete-modal';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Helper functions
async function triggerNotifications (data) {
  let stringData = ""
  // console.log(data)
  for (notifObject of data){
    stringData += "● " + notifObject.message + "\n"
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your Reminders For Today",
      body: stringData,
      data: { data: "goes here" },
    },
    trigger: { seconds: 2, repeats: false },
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your Reminders For Today",
      body: stringData,
      data: { data: "goes here" },
    },
    trigger: { seconds: 60*60*24, repeats: true },
  });
}

async function cancelNotifs(){
  await Notifications.cancelAllScheduledNotificationsAsync();
}


// Main Page
export default function App() {
  const [reminders, setReminders] = React.useState([])
  const [reminderMessage, setReminderMessage] = React.useState("")

  const [loading, setLoading] = React.useState(true);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState("")
  const [isModalVisibile, setIsModalVisibile] = React.useState(false)

  // Initialising
  async function init(){
    // await SecureStore.setItemAsync("items", JSON.stringify([
    //   {id: uid(), message: "Reminder to not let hate get to you."},
    // ]));

    let reminders = await SecureStore.getItemAsync("items")
    if (reminders) {
      reminders = JSON.parse(reminders);
  
      setReminders(reminders);
      setLoading(false)
    }
  }

  React.useEffect(() => {
    init()
  }, [])
  

  return (
    <View className="bg-[#DAF5F0]">
    <SafeAreaView className="h-full">
      <View className="flex flex-col h-full">
        {/* Reminders List */}
        <ScrollView className="flex-1">
          { 
            loading? <></> : reminders ? 
            reminders.map((reminder, index)=>{
              let colorList = ["BAFDA2", "E3DFF2", "FEFC96", "F7D6B4"]
              let color = colorList[index % colorList.length]
              return (
                <View key={reminder.id} className="mx-4 mb-3">
                  <Shadow className="rounded-xl" stretch={true} offset={[6, 6]} distance={0} startColor='#000000ff'>
                    <Pressable 
                      onPress={()=>{
                        setIsDeleteModalVisible(true);
                        setDeleteId(reminder.id);
                      }}
                      style={{"backgroundColor": `#${color}`}} 
                      className={`rounded-xl border-2 p-3 active:translate-x-1 active:translate-y-1`}>
                      <Text style={{fontFamily: "Archivo"}} className="text-base">{reminder.message}</Text>
                    </Pressable>
                  </Shadow>
                </View>
            )}) : <></>
          }
        </ScrollView>
        
        {/* Bottom Bar */}
        <View className="absolute right-4 bottom-4 p-4">
          <Shadow className="rounded-xl"  offset={[5,5]} distance={0} startColor='#000000ff'>
            <Pressable onPress={()=>{
                setIsModalVisibile(true);
              }} 
              className="border-2 w-16 h-16 flex items-center justify-center rounded-xl bg-[#BAFDA2] fixed active:translate-x-1 active:translate-y-1">
                <Text className="text-2xl">
                  +
                </Text>
              </Pressable>
          </Shadow>
        </View>
        
        <AddModal 
          reminderMessage={reminderMessage} 
          isModalVisibile={isModalVisibile} 
          setIsModalVisibile={setIsModalVisibile}
          setReminderMessage={setReminderMessage} 
          setReminders={setReminders}
          cancelNotifs={cancelNotifs}
          triggerNotifications={triggerNotifications}>
        </AddModal>
        <DeleteModal 
          isModalVisibile={isDeleteModalVisible}
          setIsModalVisibile={setIsDeleteModalVisible}
          setReminders={setReminders}
          cancelNotifs={cancelNotifs}
          triggerNotifications={triggerNotifications}
          id={deleteId}>  
        </DeleteModal>
      </View>
    </SafeAreaView>
    </View>
  );
}