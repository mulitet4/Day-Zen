import { Text, View, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { Shadow } from 'react-native-shadow-2';
import Modal from "react-native-modal";
import { useFonts } from 'expo-font';
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


async function triggerNotifications (data) {
  let stringData = ""
  console.log(data)
  for (notifObject of data){
    stringData += "● " + notifObject.message + "\n"
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your Reminders For Today",
      body: stringData,
      data: { data: "goes here" },
    },
    trigger: { seconds: 60*60*24, repeats: true },
  });
}

export default function App() {
  const [reminders, setReminders] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const [isModalVisibile, setIsModalVisibile] = React.useState(false)
  const [reminderMessage, setReminderMessage] = React.useState("")
  const [fontsLoaded] = useFonts({
    'Archivo': require('../assets/fonts/Archivo.ttf'),
  });



  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  async function init(){
    // await SecureStore.setItemAsync("items", JSON.stringify([
    //   {id: uid(), message: "Reminder to not let hate get to you."},
    // ]));

    let reminders = await SecureStore.getItemAsync("items")
    reminders = JSON.parse(reminders);

    setReminders(reminders);
    setLoading(false)
  }

  React.useEffect(() => {
    init()
  }, [])
  

  return (
    <View className="bg-[#DAF5F0]">
    <SafeAreaView className="h-full">
      <View className="flex flex-col h-full">

        <ScrollView className="flex-1">
          { 
            loading? <></> : reminders.map((reminder, index)=>{
              let colorList = ["BAFDA2", "E3DFF2", "FEFC96", "F7D6B4"]
              let color = colorList[index % colorList.length]
              return (
                <View key={reminder.id} className="mx-4 mb-3">
                  <Shadow className="rounded-xl" stretch={true} offset={[6, 6]} distance={0} startColor='#000000ff'>
                    <Pressable style={{"backgroundColor": `#${color}`}} className={`rounded-xl border-2 p-3 active:translate-x-1 active:translate-y-1`}>
                      <Text style={{fontFamily: "Archivo"}} className="text-base">{reminder.message}</Text>
                    </Pressable>
                  </Shadow>
                </View>
            )})
          }
        </ScrollView>
        
        <View className="absolute right-4 bottom-4 p-4">
          <Shadow className="rounded-xl"  offset={[5,5]} distance={0} startColor='#000000ff'>
            <Pressable onPress={()=>{
              triggerNotifications();
              setIsModalVisibile(true);
              }} className="border-2 w-16 h-16 flex items-center justify-center rounded-xl bg-[#BAFDA2] fixed active:translate-x-1 active:translate-y-1"><Text className="text-2xl">+</Text></Pressable>
          </Shadow>
        </View>

        <Modal isVisible={isModalVisibile} backdropOpacity={0.5}>
          <View className="flex items-center justify-center">
          <Shadow className="rounded-xl"  offset={[7, 7]} distance={0} startColor='#000000ff'>
            <View className="bg-[#DAF5F0] p-4 rounded-xl flex flex-col items-center border-4">
              <Text style={{fontFamily: "Archivo"}} className="m-3 text-lg">Enter your Reminder</Text>
              <View className="w-52">
                <Shadow className="rounded-2xl" stretch={true} offset={[4,5]} distance={0} startColor='#000000ff'>
                  <TextInput value={reminderMessage} onChangeText={(value)=>{setReminderMessage(value)}} multiline={true} style={{fontFamily: "Archivo"}} className="border-2 rounded-2xl p-3 bg-[#BAFDA2] w-full"></TextInput>
                </Shadow>
              </View>
              <View className="flex flex-row my-4">
                <Shadow className="rounded-xl mr-3"  offset={[4,4]} distance={0} startColor='#000000ff'>
                  <Pressable onPress={async ()=>{
                    if(reminderMessage == "" || reminderMessage == null){
                      return
                    }
                    let reminders = await SecureStore.getItemAsync("items")
                    reminders = JSON.parse(reminders);
                    reminders.push({id: uid(), message: reminderMessage})
                    await SecureStore.setItemAsync("items", JSON.stringify(reminders))
                    setReminders(reminders)
                    await Notifications.cancelAllScheduledNotificationsAsync()
                    await triggerNotifications(reminders)
                    setIsModalVisibile(false)
                  }} className="border-2 rounded-xl p-3 bg-[#BAFDA2] active:translate-x-1 active:translate-y-1"><Text>Done</Text></Pressable>
                </Shadow>
                <Shadow className="rounded-xl" offset={[4,4]} distance={0} startColor='#000000ff'>
                  <Pressable onPress={()=>{setIsModalVisibile(false)}} className="border-2 rounded-xl p-3 bg-[#BAFDA2] active:translate-x-1 active:translate-y-1"><Text>Cancel</Text></Pressable>
                </Shadow>
              </View>
            </View>
            </Shadow>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
    </View>
  );
}