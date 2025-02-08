import React, { useState,useEffect } from "react";
import { 
  View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, PermissionsAndroid, Platform 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Geolocation from "react-native-geolocation-service";
import axios from "axios";

const SubjectForm = () => {
  const [name, setName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coordinates, setCoordinates] = useState({ latitude: "", longitude: "" });
  const [schedule, setSchedule] = useState([{ day: "Monday", time: "" }]);

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index][field] = value;
    setSchedule(updatedSchedule);
  };

  const addSchedule = () => {
    setSchedule([...schedule, { day: "Monday", time: "" }]);
  };

  
  const handleSubmit = async () => {
    try {
      console.log({ name, locationName, coordinates, schedule });
      const response = await axios.post(`http://10.10.60.231:5000/api/subjects/create`, {
        name,
        locationName,
        coordinates,
        schedule,
      });
      console.log("Subject created:", response.data);
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter subject name"
      />

      <Text style={styles.label}>Location Name:</Text>
      <TextInput
        style={styles.input}
        value={locationName}
        onChangeText={setLocationName}
        placeholder="Enter location name"
      />

      <Text style={styles.label}>Latitude:</Text>
      <TextInput
        style={styles.input}
        value={coordinates.latitude}
        onChangeText={(value) => setCoordinates({ ...coordinates, latitude: value })}
        placeholder="Enter latitude"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitude:</Text>
      <TextInput
        style={styles.input}
        value={coordinates.longitude}
        onChangeText={(value) => setCoordinates({ ...coordinates, longitude: value })}
        placeholder="Enter longitude"
        keyboardType="numeric"
      />

      <Button title="Detect Location" onPress={detectLocation} />

      <Text style={styles.label}>Schedule:</Text>
      {schedule.map((entry, index) => (
        <View key={index} style={styles.scheduleContainer}>
          <Picker
            selectedValue={entry.day}
            onValueChange={(value) => handleScheduleChange(index, "day", value)}
            style={styles.picker}
          >
            <Picker.Item label="Monday" value="Monday" />
            <Picker.Item label="Tuesday" value="Tuesday" />
            <Picker.Item label="Wednesday" value="Wednesday" />
            <Picker.Item label="Thursday" value="Thursday" />
            <Picker.Item label="Friday" value="Friday" />
            <Picker.Item label="Saturday" value="Saturday" />
            <Picker.Item label="Sunday" value="Sunday" />
          </Picker>

          <TextInput
            style={styles.input}
            value={entry.time}
            onChangeText={(value) => handleScheduleChange(index, "time", value)}
            placeholder="Enter time (e.g., 09:00 AM)"
          />
        </View>
      ))}

      <Button title="Add Schedule" onPress={addSchedule} />
      <View style={styles.submitButton}>
        <Button title="Create Subject" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  scheduleContainer: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  picker: {
    marginBottom: 16,
    height: 50,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default SubjectForm;
