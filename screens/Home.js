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
  FlatList,
} from "react-native";
import AppStateContext from "../AppContext";

function HomeHeader() {
  return (
    <View>
      <View>
        <Text>Little Lemon</Text>
        <Text>Chicago</Text>
        <Text>
          We are a family owned Mediterranean restaurant focused on traditional
          recipes served with a modern twist.
        </Text>
        <Text>[Finder icon]</Text>
      </View>
      <View>
        <Text>Order for delivery</Text>
        <Text>[Category filters]</Text>
      </View>
    </View>
  );
}
export default function HomeScreen() {
  const data = [
    {
      name: "Greek Salad",
      price: 12.99,
      description:
        "Our delicious salad is served with Feta cheese and peeled cucumber. Includes tomatoes, onions, olives, salt and oregano in the ingredients.",
      image: "greekSalad.jpg",
    },
    {
      name: "Bruschetta",
      price: 7.99,
      description:
        "Delicious grilled bread rubbed with garlic and topped with olive oil and salt. Our Bruschetta includes tomato and cheese.",
      image: "bruschetta.jpg",
    },
  ];
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.name + item.image}
        renderItem={ItemView}
        ListHeaderComponent={HomeHeader}
      />
    </View>
  );
}

const ItemView = ({ item }) => {

    function trimText(text, limit) {
        if (text.length > limit) {
            return text.substring(0, limit) + "..."
        } else {
            return text
        }
    }
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemHeader}>{item.name}</Text>
      <View style={styles.flexRow}>
        <View style={styles.flexTextInfo}>
          <Text style={styles.itemDescription}>{trimText(item.description, 80)}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
        <Image source={require("../assets/icon.png")} style={styles.foodImg} />
      </View>

      {/*<Image source={{ uri: item.image }} style={styles.foodImg} />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  foodImg: {
    width: 100,
    height: 100,
    flex: 1,
  },
  itemContainer: {
    margin: 10,
    flexDirection: "column",
  },
  itemHeader: {
    fontSize: 20,
    fontWeight: "500",
  },
  itemDescription: {
    fontSize: 14,
    flex: 1,
  },
  itemPrice: {
    fontSize: 18,
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  flexTextInfo: {
    flexDirection: "column",
    flex: 1.5,
  },
  flexItem: {
    width: 100,
  },
  box: {
    width: 50,
    height: 50,
  },
});
