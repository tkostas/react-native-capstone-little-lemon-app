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
  const [stateUpdated, setStateUpdated] = useState(false);
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

  useEffect(() => {
    console.log("initial state: " + JSON.stringify(state));
    getLocalOnboardingStatus().then((storedLoginStatus) => {

      setState({...state, isLoading: false})
      // setState({
      //   ...state,
      //   isLoading: false,
      //   isOnboardingCompleted: storedLoginStatus,
      // });
      //   // setIsLoggedIn(storedLoginStatus);
      console.log("initially loaded state: " + JSON.stringify(state));
      console.log("onLoad storedLoginStatus: " + storedLoginStatus);
      console.log("---\n");
    });

  }, []);

  // TODO - persist state on async storage
  // useEffect(() => {
  //   getLocalOnboardingStatus().then((storedLoginStatus) => {
  //     if (storedLoginStatus && !state.isOnboardingCompleted) {
  //       console.log("user selected to logout - empty block");
  //     }
  //     if (storedLoginStatus && state.isOnboardingCompleted) {
  //       console.log(
  //         "onboarding completed and app initially loaded --> load state from asyncstorage",
  //       );
  //       const keys = [
  //         "avatarInitials",
  //         "avatarUri",
  //         "firstName",
  //         "lastName",
  //         "email",
  //         "phoneNumber",
  //         "emailOtherStatuses",
  //         "emailPasswordChanges",
  //         "emailSpecialOffers",
  //         "emailNewsletter",
  //       ];
  //
  //       // AsyncStorage.multiGet(keys).then((values) => {
  //       //   let parsedValues = {};
  //       //   for (const pair of values) {
  //       //     try {
  //       //       const value = JSON.parse(pair[1]);
  //       //       if (value == null) {
  //       //         parsedValues[pair[0]] = value;
  //       //       }
  //       //     } catch (e) {
  //       //       console.log(e);
  //       //     }
  //       //   }
  //       //   if (!stateUpdated) {
  //       //     setStateUpdated(true);
  //       //     setState({ ...state, ...parsedValues });
  //       //   }
  //       //
  //       //   console.log(parsedValues);
  //       // });
  //       console.log(state);
  //     }
  //     if (!storedLoginStatus && !state.isOnboardingCompleted) {
  //       console.log(
  //         "onboarding is not completed and app initially loaded --> nothing to update",
  //       );
  //       console.log(state);
  //     }
  //     if (!storedLoginStatus && state.isOnboardingCompleted) {
  //       console.log("new login");
  //       // AsyncStorage.multiSet(
  //       //   [
  //       //     ["isOnboardingCompleted", JSON.stringify(true)],
  //       //     ["firstName", JSON.stringify(state.firstName)],
  //       //     ["email", JSON.stringify(state.email)],
  //       //   ],
  //       //   () => {
  //       //     setState({
  //       //       ...state,
  //       //       isOnboardingCompleted: true,
  //       //       isLoading: false,
  //       //     });
  //       //   },
  //       // );
  //       console.log(state);
  //     }
  //     console.log("onUpdate storedLoginStatus: " + storedLoginStatus);
  //     console.log("-----");
  //   });
  // }, [state]);

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
      value={{ state, setState, setRequestLogout }}
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