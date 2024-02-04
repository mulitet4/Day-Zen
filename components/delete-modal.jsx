import { View, Text, TextInput, Pressable } from 'react-native'
import React from 'react'

import Modal from "react-native-modal";
import { Shadow } from 'react-native-shadow-2';
import * as SecureStore from 'expo-secure-store';

const DeleteModal = ({isModalVisibile, setIsModalVisibile, setReminders, cancelNotifs, triggerNotifications, id}) => {
  return (
    <Modal isVisible={isModalVisibile} backdropOpacity={0.5}>
    <View className="flex items-center justify-center">
      <Shadow className="rounded-xl"  offset={[7, 7]} distance={0} startColor='#000000ff'>
        <View className="bg-[#DAF5F0] p-4 rounded-xl flex flex-col items-center border-4">
          {/* Modal Title */}
          <Text 
            style={{fontFamily: "Archivo"}} 
            className="m-3 text-lg">
              Delete This Reminder?
          </Text>

        {/* Add Button */}
        <View className="flex flex-row my-4">
          <Shadow className="rounded-xl mr-3"  offset={[4,4]} distance={0} startColor='#000000ff'>
            <Pressable 
              onPress={async ()=>{
                let reminders = await SecureStore.getItemAsync("items")
                reminders = JSON.parse(reminders);
                
                for (reminder of reminders) {
                  if (reminder.id == id) {
                    reminders.pop(reminder);
                  }
                }

                await SecureStore.setItemAsync("items", JSON.stringify(reminders))
                setReminders(reminders)

                await cancelNotifs()
                await triggerNotifications(reminders)

                setIsModalVisibile(false)
              }} 
              className="border-2 rounded-xl p-3 bg-[#BAFDA2] active:translate-x-1 active:translate-y-1">
              <Text>Done</Text>
            </Pressable>
          </Shadow>
          
          {/* Cancel Button */}
          <Shadow className="rounded-xl" offset={[4,4]} distance={0} startColor='#000000ff'>
            <Pressable 
              onPress={()=>{setIsModalVisibile(false)}} 
              className="border-2 rounded-xl p-3 bg-[#BAFDA2] active:translate-x-1 active:translate-y-1">
              <Text>Cancel</Text>
            </Pressable>
          </Shadow>
        </View>
      </View>
      </Shadow>
    </View>
  </Modal>
  )
}

export default DeleteModal