import * as React from "react";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { HomeHeader } from "../components/HomeHeader";
import {
  createTableIfNotExists,
  filterByQueryAndCategories,
  getCategories,
  insertData,
  readLocalData,
} from "../db/crud";

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

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtSel, setFiltSel] = useState(categories.map(() => false));
  const [query, setQuery] = useState("");

  const pullData = async () => {
    try {
      console.log("fetching data ...");
      const response = await fetch(
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json",
      );
      const json = await response.json();
      insertData(json.menu);
      console.log("pulling data");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      let results = await readLocalData();
      if (results.length > 0) {
        setData(results);
      } else {
        await pullData();
        results = await readLocalData();
        setData(results);
      }
      const uniqueCategories = await getCategories();
      setCategories(uniqueCategories);
    };

    createTableIfNotExists();
    fetchData();
  }, []);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
    } else {
      const activeCategories = categories.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filtSel.every((item) => item === false)) {
          return true;
        }
        return filtSel[i];
      });
      try {
        filterByQueryAndCategories(query, activeCategories).then(
          (menuItems) => {
            setData(menuItems);
          },
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, [filtSel, query]);

  const handleSelectCategory = async (index) => {
    const arrayCopy = [...filtSel];
    arrayCopy[index] = !filtSel[index];
    setFiltSel(arrayCopy);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.name + item.image}
        renderItem={ItemView}
        ListHeaderComponent={
          <HomeHeader
            query={query}
            onChangeQuery={setQuery}
            categories={categories}
            selections={filtSel}
            onChange={handleSelectCategory}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#495e57",
    padding: 10,
  },
  headerTitle: {
    color: "#f3cd14",
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
  quickFilterButton: {
    paddingHorizontal: 10,
    padding: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#b7b7b7",
  },
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
