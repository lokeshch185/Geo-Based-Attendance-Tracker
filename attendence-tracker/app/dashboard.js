import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import SubjectForm from '../components/SubjectForm.js';
import SubjectList from '../components/SubjectList.js';

const Tab = createBottomTabNavigator();

export default function Dashboard() {
  return (
    <Tab.Navigator
      initialRouteName="Subjects"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Subjects') {
            iconName = 'view-list';
          } else if (route.name === 'Add Subject') {
            iconName = 'plus-box';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Subjects" component={SubjectList} />
      <Tab.Screen name="Subjects" component={SubjectList} />
      <Tab.Screen name="Add Subject" component={SubjectForm} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const SettingsScreen = () => {
  return (
    <View style={styles.settingsContainer}>
      <Text>Settings or additional content goes here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
