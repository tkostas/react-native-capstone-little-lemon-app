import * as React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Onboarding from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import HomeScreen from "./screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { SplashScreen } from "./screens/SplashScreen";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppStateContext from "./AppContext";

const Stack = createNativeStackNavigator();


function HomeHeader(props) {
  const navigation = useNavigation();

  return (
    <View style={styles.flexRow}>
      <Text style={styles.title}>{props.children}</Text>
      <View style={styles.avatarContainer}>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          {props.avatarUri && (
            <Image source={{ uri: props.avatarUri }} style={styles.avatarImg} />
          )}
          {!props.avatarUri && (
            <Text style={styles.avatarText}>{props.avatarInitials}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saveChanges, setSaveChanges] = useState(false);
  const [requestLogout, setRequestLogout] = useState(false);
  const defaultState = {
    isLoading: true,
    isOnboardingCompleted: isLoggedIn,
  };
  const [state, setState] = useState(defaultState);

  const loadLocalState = async () => {
    try {
      const savedState = await AsyncStorage.getItem("appState");
      if (savedState !== null) {
        let parsedState = JSON.parse(savedState);
        console.log("parsed local state: " + JSON.stringify(parsedState));
        return parsedState;
      } else {
        return defaultState;
      }
    } catch (e) {
      return defaultState;
    }
  };

  useEffect(() => {
    console.log("initial state: " + JSON.stringify(state));
    loadLocalState().then((loadedState) => {
      setState({ ...state, ...loadedState, isLoading: false });
      console.log("initially loaded state: " + JSON.stringify(state));
    });
  }, []);

  useEffect(() => {
    if (saveChanges) {
      console.log("Persisting Updated state: " + JSON.stringify(state));

      try {
        AsyncStorage.setItem("appState", JSON.stringify(state));
      } catch (e) {
        console.error(e);
      }

      setSaveChanges(false);
    }
  }, [saveChanges]);

  useEffect(() => {
    if (requestLogout) {
      console.log(
        "user selected to logout --> setting state to default\n---------",
      );
      AsyncStorage.setItem("isOnboardingCompleted", JSON.stringify(false)).then(
        () => {
          setState({ ...defaultState, isLoading: false });
          console.log(state);
        },
      );
      setRequestLogout(false);
    }
  }, [requestLogout]);

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AppStateContext.Provider
      value={{ state, setState, setRequestLogout, setSaveChanges }}
    >
      <NavigationContainer>
        <Stack.Navigator>
          {state.isOnboardingCompleted ? (
            // onboarding completed, user is signed in
            <React.Fragment>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: "Welcome to Little Lemon",
                  headerTitle: (props) => <HomeHeader {...props} {...state} />,
                }}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                  title: "Personal Info",
                  headerTitle: (props) => (
                    <HomeHeader {...props} {...state} />
                  ),
                }}
              />
            </React.Fragment>
          ) : (
            // user is not singed in
            <Stack.Screen name="Onboarding" component={Onboarding} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppStateContext.Provider>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#47733e",
    marginRight: 20,
  },
  avatarText: {
    textAlign: "center",
    color: "#e5e3e3",
    fontWeight: "600",
    fontSize: 10,
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
