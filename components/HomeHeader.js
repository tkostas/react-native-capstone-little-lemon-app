import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { capitalizeFirstLetter } from "../utils/text";

export function HomeHeader({
  query,
  onChangeQuery,
  categories,
  selections,
  onChange,
}) {
  const [localQuery, setLocalQuery] = useState(query ? query : "");

  const debounceSearch = debounce(onChangeQuery, 500);

  function handleUpdateSearchQuery(text) {
    console.log(text);
    setLocalQuery(text);
    debounceSearch(text);
  }
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
            source={require("../assets/C_zXbtvtRoqAhOAfS1aZLw_b43e5a291d3644cc99795e9a6649f5f1_Pict.png")}
            style={styles.headerImg}
          />
        </View>

        <View style={styles.searchContainer}>
          <Image
            source={require("../assets/magnifier.png")}
            style={styles.finderImg}
          />
          <TextInput
            style={styles.searchInput}
            value={localQuery}
            onChangeText={handleUpdateSearchQuery}
            placeholder="filter menu"
          />
        </View>
      </View>
      <View style={styles.quickFilterContainer}>
        <Text style={styles.quickFilterHeader}>Order for delivery</Text>
        <ScrollView horizontal={true} showHorizontalScrollIndicator={false}>
          <View style={styles.flexRow}>
            {categories.map((category, index) => (
              <TouchableOpacity
                onPress={() => onChange(index)}
                style={[
                  styles.quickFilterButton,
                  selections[index] && styles.selectedFilter,
                ]}
                key={index}
              >
                <View>
                  <Text>{capitalizeFirstLetter(category)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
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
    height: 130,
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
    backgroundColor: "#e3e3e3",
  },
  selectedFilter: {
    backgroundColor: "#a4a4a4",
    fontWeight: "600",
  },
  searchContainer: {
    marginVertical: 10,
    flexDirection: "row",
  },
  finderImg: {
    width: 30,
    height: 30,
    marginVertical: 4,
  },
  searchInput: {
    marginHorizontal: 10,
    backgroundColor: "#cbcbcb",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexGrow: 2,
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
