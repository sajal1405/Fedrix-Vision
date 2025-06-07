// mobile/App.js

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Button,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { supabase } from "../src/supabaseClient";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        {profile ? `Welcome ${profile.full_name}` : "Loading..."}
      </Text>
      <Button title="Profile" onPress={() => navigation.navigate("Profile")}></Button>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    getUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{user ? user.email : "No user"}</Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#6f0c8a",
    fontSize: 20,
    fontWeight: "600",
  },
});
