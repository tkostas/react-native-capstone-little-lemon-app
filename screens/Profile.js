import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import AppStateContext from "../AppContext";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { MaskedTextInput, unMask } from "react-native-mask-text";

const validateEmail = (email) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validateName = (name) => {
  return name.trim() !== "";
};

const validatePhoneNum = (phoneNum) => {
  if (phoneNum.length === 10) {
    return true
  } else {
    return false
  }
};

export default function ProfileScreen() {
  const { state, setState, setRequestLogout } =
    React.useContext(AppStateContext);
  const [avatarInitials, setAvatarInitials] = React.useState();
  const [avatarUri, setAvatarUri] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [emailOtherStatuses, setEmailOtherStatuses] = React.useState();
  const [emailPasswordChanges, setEmailPasswordChanges] = React.useState();
  const [emailSpecialOffers, setEmailSpecialOffers] = React.useState();
  const [emailNewsletter, setEmailNewsletter] = React.useState();

  const loadDefaultValues = () => {
    setAvatarInitials("UNK");
    setAvatarUri(state.avatarUri ? state.avatarUri : "");
    setFirstName(state.firstName ? state.firstName : "");
    setLastName(state.lastName ? state.lastName : "");
    setEmail(state.email ? state.email : "");
    setPhoneNumber(state.phoneNumber ? state.phoneNumber : "");
    setEmailPasswordChanges(
      state.emailPasswordChanges ? state.emailPasswordChanges : true,
    );
    setEmailOtherStatuses(
      state.emailOtherStatuses ? state.emailOtherStatuses : true,
    );
    setEmailSpecialOffers(
      state.emailSpecialOffers ? state.emailSpecialOffers : true,
    );
    setEmailNewsletter(state.emailNewsletter ? state.emailNewsletter : true);
  };

  React.useEffect(() => {
    console.log("Profile screen - state on initial loading");
    console.log(state);
    loadDefaultValues();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.assets.length > 0) {
      const imgUri = result.assets[0].uri;
      setAvatarUri(imgUri);
    }
  };
  const removeImage = () => {
    setAvatarUri("");
  };

  const handleLogout = () => {
    setRequestLogout(true);
  };

  const handleDiscardChanges = () => {
    loadDefaultValues();
  };

  const handleSaveChanges = () => {
    const hasValidFirstName = validateName(firstName);
    const hasValidLastName = validateName(lastName);
    const hasValidEmail = validateEmail(email);
    const hasValidPhoneNumber = validatePhoneNum(phoneNumber);

    if (!hasValidFirstName) {
      Alert.alert("Invalid first name.");
    }
    if (!hasValidLastName) {
      Alert.alert("Invalid last name.");
    }
    if (!hasValidEmail) {
      Alert.alert("Invalid e-mail");
    }
    if (!hasValidPhoneNumber) {
      Alert.alert("Invalid phone number.");
    }

    if (
      hasValidFirstName &&
      hasValidLastName &&
      hasValidEmail &&
      hasValidPhoneNumber
    ) {
      console.log('profile view --> updating state')
      setState({
        ...state,
        firstName,
        lastName,
        email,
        phoneNumber,
        avatarInitials,
        avatarUri,
        emailOtherStatuses,
        emailPasswordChanges,
        emailSpecialOffers,
        emailNewsletter,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Personal information</Text>
      <Text style={styles.inputLabel}>Avatar</Text>
      <View style={styles.flexRow}>
        <View style={styles.avatarContainer}>
          {avatarUri && (
            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
          )}
          {!avatarUri && (
            <Text style={styles.avatarText}>{avatarInitials}</Text>
          )}
        </View>
        <Pressable onPress={pickImage} style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Change</Text>
        </Pressable>
        <Pressable onPress={removeImage} style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Remove</Text>
        </Pressable>
      </View>
      <Text style={styles.inputLabel}>First name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        style={styles.textInput}
      />
      <Text style={styles.inputLabel}>Last name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        style={styles.textInput}
      />

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
      />
      <Text style={styles.inputLabel}>Phone number</Text>
      <MaskedTextInput
        mask="(999) 999 9999"
        value={phoneNumber}
        style={styles.textInput}
        onChangeText={(text, rawText) => {
          setPhoneNumber(rawText);
        }}
        placeholder="(123) 456-7890"
        keyboardType="phone-pad"
      />

      <Text style={styles.title}>Email notifications</Text>
      <View style={styles.flexRow}>
        <Checkbox
          value={emailOtherStatuses}
          onValueChange={setEmailOtherStatuses}
          style={styles.checkbox}
          color={emailOtherStatuses ? "#3e524b" : "#d5d7d9"}
        />
        <Text style={styles.inputLabel}>Order statuses</Text>
      </View>
      <View style={styles.flexRow}>
        <Checkbox
          value={emailPasswordChanges}
          onValueChange={setEmailPasswordChanges}
          style={styles.checkbox}
          color={emailPasswordChanges ? "#3e524b" : "#d5d7d9"}
        />
        <Text style={styles.inputLabel}>Password changes</Text>
      </View>
      <View style={styles.flexRow}>
        <Checkbox
          value={emailSpecialOffers}
          onValueChange={setEmailSpecialOffers}
          style={styles.checkbox}
          color={emailSpecialOffers ? "#3e524b" : "#d5d7d9"}
        />
        <Text style={styles.inputLabel}>Special offers</Text>
      </View>
      <View style={styles.flexRow}>
        <Checkbox
          value={emailNewsletter}
          onValueChange={setEmailNewsletter}
          style={styles.checkbox}
          color={emailNewsletter ? "#3e524b" : "#d5d7d9"}
        />
        <Text style={styles.inputLabel}>Newsletter</Text>
      </View>
      <View>
        <Pressable onPress={handleLogout} style={styles.btnFullWidth}>
          <Text style={styles.btnFullWidthText}>Log out</Text>
        </Pressable>
      </View>
      <View style={styles.flexRowCentered}>
        <Pressable
          onPress={handleDiscardChanges}
          style={styles.buttonSecondary}
        >
          <Text style={styles.buttonSecondaryText}>Discard changes</Text>
        </Pressable>
        <Pressable onPress={handleSaveChanges} style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Save changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#8d8d8d",
    padding: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#47733e",
  },
  avatarText: {
    textAlign: "center",
    color: "#e5e3e3",
    fontWeight: "600",
    fontSize: 22,
  },
  avatarImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  flexRowCentered: { flexDirection: "row", justifyContent: "center" },
  titleSection: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "left",
  },
  textInput: {
    borderWidth: 1,
    width: "100%",
    height: 40,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#a1a0a0",
  },
  checkbox: {
    borderRadius: 5,
    backgroundColor: "#a1a0a0",
    borderWidth: 1,
  },
  inputLabel: {
    fontSize: 16,
    textAlign: "left",
    marginLeft: 8,
  },
  btnFullWidth: {
    backgroundColor: "#ceae12",
    padding: 10,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  btnFullWidthText: {
    fontSize: 18,
    fontWeight: "500",
  },
  buttonPrimary: {
    backgroundColor: "#495e57",
    padding: 10,
    margin: 8,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonPrimaryText: {
    color: "#c7cbce",
  },
  buttonSecondary: {
    backgroundColor: "#a1a0a0",
    padding: 10,
    margin: 8,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonSecondaryText: {
    color: "#363636",
  },
});
