import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://192.168.1.7:5000/api/subjects`);
        setSubjects(response.data);
        console.log("Subjects fetched:", response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading subjects...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={subjects}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>Location: {item.locationName}</Text>
          <Button
            title="View Attendance"
            onPress={() =>
              router.push(
                `/attendance?subjectId=${item._id}`
              )
            }
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  name: { fontWeight: 'bold', fontSize: 18 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SubjectList;
