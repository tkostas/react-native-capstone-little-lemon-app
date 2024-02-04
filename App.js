import * as React from "react";
import { Alert, StyleSheet } from "react-native";
import Onboarding from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SplashScreen } from "./screens/SplashScreen";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppStateContext from "./AppContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saveChanges, setSaveChanges] = useState(false);
  const [requestLogout, setRequestLogout] = useState(false);
  const defaultState = {
    isLoading: true,
    isOnboardingCompleted: isLoggedIn,
  };
  const [state, setState] = useState(defaultState);

  const getLocalOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("isOnboardingCompleted");
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  const loadLocalState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('appState')
      if (savedState !== null) {
        let parsedState = JSON.parse(savedState)
        console.log('parsed local state: '+ JSON.stringify(parsedState))
        return parsedState
      } else {
        return defaultState
      }
    } catch (e) {
      return defaultState
    }
  }

  useEffect(() => {
    console.log("initial state: " + JSON.stringify(state));
    loadLocalState().then((loadedState) => {
      setState({...state, ...loadedState, isLoading: false})
        console.log("initially loaded state: " + JSON.stringify(state));

    })
    // getLocalOnboardingStatus().then((storedLoginStatus) => {
    //   setState({ ...state, isLoading: false });
    //   console.log("initially loaded state: " + JSON.stringify(state));
    //   console.log("onLoad storedLoginStatus: " + storedLoginStatus);
    //   console.log("---\n");
    // });
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
            <Stack.Screen name="Profile" component={ProfileScreen} />
          ) : (
            // user is not singed in
            <Stack.Screen name="Onboarding" component={Onboarding} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppStateContext.Provider>
  );
}
