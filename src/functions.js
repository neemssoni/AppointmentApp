import AsyncStorage from '@react-native-async-storage/async-storage';

export const getBookedSlots = async () => {
  let bookedSlots = await AsyncStorage.getItem('bookedSlots');
  if (bookedSlots) {
    bookedSlots = JSON.parse(bookedSlots);
  } else {
    bookedSlots = {};
  }
  return bookedSlots;
};
