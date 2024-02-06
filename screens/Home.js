import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon");

const ItemView = ({ item }) => {
  function trimText(text, limit) {
    if (text.length > limit) {
      return text.substring(0, limit) + "...";
    } else {
      return text;
    }
  }
  const imgUri = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemHeader}>{item.name}</Text>
      <View style={styles.flexRow}>
        <View style={styles.flexTextInfo}>
          <Text style={styles.itemDescription}>
            {trimText(item.description, 80)}
          </Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
        <Image source={{ uri: imgUri }} style={styles.foodImg} />
      </View>
    </View>
  );
};

function HomeHeader() {
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Little Lemon</Text>
        <View style={styles.flexRow}>
          <View style={styles.flexTextInfo}>
            <Text style={styles.headerSubtitle}>Chicago</Text>
            <Text style={styles.headerText}>
              We are a family owned Mediterranean restaurant focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            source={require("../assets/icon.png")}
            style={styles.headerImg}
          />
        </View>

        <Image
          source={require("../assets/icon.png")}
          style={styles.finderImg}
        />
      </View>
      <View style={styles.quickFilterContainer}>
        <Text style={styles.quickFilterHeader}>Order for delivery</Text>
        <Text style={styles.quickFilterButton}>[Category filters]</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const pullData = async () => {
    try {
      console.log("fetching data ...");
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json",
      );
      const json = await response.json();
      db.transaction((tx) => {
        json.menu.forEach((item) => {
          tx.executeSql(
            `INSERT INTO menuItems (name, category, price, description, image) values (?, ?, ?, ?, ?)`,
            [
              item.name,
              item.category,
              item.price,
              item.description,
              item.image,
            ],
            (insertResults) => console.log("Successful insertion"),
          ),
            (_, error) => console.log("data insertion error: ", error);
        });
      });

      // setData(json.menu);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const createTableIfNotExists = () => {
    db.transaction((tx) => {
      // tx.executeSql(
      //     "DROP TABLE IF EXISTS menuItems",
      //     [],
      //     () => { console.log('table dropped')},
      //     (_, error) => {console.log('error: ', error)}
      // )
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS menuItems (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT,
            category TEXT,
            price REAL,
            description TEXT,
            image TEXT

           )`,
        [],
        () => {
          console.log("table created successfully");
        },
        (_, error) => {
          console.error("Error occured while creating table", error);
        },
      );
    });
  };

  const readLocalData = async () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM menuItems",
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => {
            console.log("Database read error:", error);
            reject(error);
          },
        );
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      let results = await readLocalData();
      if (results.length > 0) {
        console.log("Using local data ...");
        setData(results);
      } else {
        console.log("Requesting a new dataset ...");
        await pullData();
        results = await readLocalData();
        setData(results);
      }
    };

    createTableIfNotExists();
    fetchData();
  }, []);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#095e2a",
    padding: 10,
  },
  headerTitle: {
    color: "#d9b628",
    fontSize: 40,
    fontWeight: "500",
  },
  headerSubtitle: {
    color: "#e0e6ea",
    fontSize: 26,
  },
  headerText: {
    color: "#e0e6ea",
    fontSize: 14,
  },
  headerImg: {
    width: 100,
    height: 150,
    flex: 1,
  },
  quickFilterContainer: {
    padding: 10,
  },
  quickFilterHeader: {
    fontSize: 24,
    fontWeight: "500",
  },
  quickFilterButton: {},
  finderImg: {
    width: 30,
    height: 30,
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
