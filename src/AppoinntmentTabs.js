import AsyncStorage from '@react-native-async-storage/async-storage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {addDays, eachHourOfInterval, endOfDay, format} from 'date-fns';
import {getTime, startOfDay} from 'date-fns/esm';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {getBookedSlots} from './functions';

const Tab = createMaterialTopTabNavigator();

const DayScreen = props => {
  const {key} = props.route;
  let date;
  if (key.includes('Today')) {
    date = new Date();
  } else if (key.includes('After')) {
    date = addDays(new Date(), 2);
  } else {
    date = addDays(new Date(), 1);
  }

  const startTime = startOfDay(date);
  const endTime = endOfDay(date);
  const hourStep = 2;
  const intervalHours = eachHourOfInterval(
    {
      start: startTime,
      end: endTime,
    },
    {step: hourStep},
  );

  const [isOpen, toggleModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentTime, setCurrentTime] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});

  const setSlots = async () => {
    const slots = await getBookedSlots();
    setBookedSlots(slots);
  };

  useEffect(() => {
    setSlots();
  });

  return (
    <View style={styles.listWrapper}>
      <FlatList
        contentContainerStyle={styles.listContainer}
        numColumns={3}
        data={intervalHours}
        renderItem={({item}) => {
          const isBooked = bookedSlots ? bookedSlots[getTime(item)] : false;
          return (
            <View style={styles.timeSlotWrapper}>
              <TouchableOpacity
                disabled={isBooked}
                style={
                  isBooked ? styles.bookedWrapper : styles.timeSlotButtonWrapper
                }
                onPress={() => {
                  setCurrentTime(item);
                  toggleModal(true);
                }}>
                <Text>{format(item, 'h a')}</Text>
                {/* {isBooked ? <Text>Booked</Text> : <></>} */}
              </TouchableOpacity>
            </View>
          );
        }}
      />
      {isOpen ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isOpen}
          onRequestClose={() => {
            toggleModal(!isOpen);
          }}>
          <View style={styles.listContainer}>
            <View style={styles.header}>
              <Text style={styles.buttonText}> Enter User Details</Text>
            </View>
            <TextInput
              value={name}
              placeholder="Name"
              onChangeText={text => {
                setName(text);
              }}
            />
            <TextInput
              value={email}
              placeholder="Email"
              onChangeText={text => {
                setEmail(text);
              }}
            />
            <TextInput
              value={phoneNumber}
              placeholder="Phone Number"
              onChangeText={text => {
                setPhoneNumber(text);
              }}
            />
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.bookButton, styles.buttonClose]}
                onPress={() => toggleModal(!isOpen)}>
                <Text style={[styles.textStyle, {color: 'black'}]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={name === '' || email === '' || phoneNumber === ''}
                style={[styles.bookButton]}
                onPress={async () => {
                  let bookedSlots = await getBookedSlots();

                  let value = {
                    name,
                    email,
                    phoneNumber,
                    slotTime: currentTime,
                  };

                  bookedSlots[getTime(currentTime)] = value;
                  const data = JSON.stringify(bookedSlots);
                  console.log({data});
                  await AsyncStorage.setItem('bookedSlots', data);
                  setBookedSlots();
                  toggleModal(!isOpen);
                  setEmail('');
                  setName('');
                  setPhoneNumber('');
                }}>
                <Text style={styles.textStyle}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        <></>
      )}
    </View>
  );
};

const AppointmentTabs = () => {
  const dayArray = [
    {name: 'Today', component: DayScreen},
    {name: 'tomorrow', component: DayScreen},
    {
      name: 'Day After Tomorrow',
      component: DayScreen,
    },
  ];
  return (
    <Tab.Navigator>
      {dayArray.map((day, index) => {
        console.log({day});
        return (
          <Tab.Screen component={day.component} key={index} name={day.name} />
        );
      })}
    </Tab.Navigator>
  );
};

export default AppointmentTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingVertical: 16,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    backgroundColor: '#498F91',
  },
  buttonClose: {
    backgroundColor: 'white',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  timeSlotWrapper: {
    flex: 1,
  },
  bookedWrapper: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#DC143C',
    borderColor: '#808080',
    alignItems: 'center',
    alignSelf: 'center',
  },
  timeSlotButtonWrapper: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#808080',
    alignItems: 'center',
    alignSelf: 'center',
  },
  listContainer: {
    padding: 16,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-around',
  },
  listWrapper: {
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#498F91',
    alignItems: 'center',

    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#808080',

    alignSelf: 'center',
  },
  textWrapper: {
    borderWidth: 1,
    borderColor: '#808080',
    width: '100%',
  },
});
