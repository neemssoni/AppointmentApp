/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Linking,
  Platform,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const HomeScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          },
        ]}>
        <View style={styles.body}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AppointmentsScreen')}
            style={styles.bookButton}>
            <Text style={styles.buttonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    height: 40,
    backgroundColor: '#498F91',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    backgroundColor: '#498F91',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
