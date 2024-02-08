import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import LittleLemonHeader from "../components/LittleLemonHeader";
import AppStateContext from "../AppContext";

const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateName = (name) => {
  return name.trim() !== "";
};

export default function Onboarding() {
  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState(null);
  const { state, setState } = React.useContext(AppStateContext);

  const handlePress = () => {
    const hasValidName = validateName(firstName);
    const hasValidEmail = validateEmail(email);
    if (!hasValidName) {
      Alert.alert("Name should not be empty");
    }
    if (!hasValidEmail) {
      Alert.alert("Email is invalid!");
    }
    if (hasValidName && hasValidEmail) {
      setState({
        ...state,
        firstName: firstName,
        email: email,
        isOnboardingCompleted: true,
        avatarInitials: firstName[0].toUpperCase(),
      });
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <LittleLemonHeader />
          <View style={styles.titleSection}>
            <Text style={styles.title}>Let us get to know you</Text>
          </View>
          <View style={styles.bodySection}>
            <Text style={styles.inputLabel}>First name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.textInput}
            />
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
            />
          </View>

          <View style={styles.footer}>
            <Pressable onPress={handlePress} style={styles.button}>
              <Text>Next</Text>
            </Pressable>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#8d8d8d",
    justifyContent: "space-between",
  },
  titleSection: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    padding: 15,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    width: "90%",
    height: 40,
    margin: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#a1a0a0",
  },
  inputLabel: {
    fontSize: 18,
    textAlign: "center",
  },
  bodySection: {
    width: "100%",
    padding: 30,
    alignItems: "center",
    verticalAlign: "bottom",
  },
  footer: {
    flex: 0.3,
    width: "100%",
    padding: 40,
    backgroundColor: "#C7C6C6FF",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#a1a0a0",
    padding: 10,
    width: 100,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
});
