import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("little_lemon");

export const createTableIfNotExists = () => {
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
        // console.log("table created successfully");
      },
      (_, error) => {
        console.error("Error occurred while creating table", error);
      },
    );
  });
};

export const readLocalData = async () => {
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

export function insertData(valuesArray) {
  db.transaction((tx) => {
    valuesArray.forEach((item) => {
      tx.executeSql(
        `INSERT INTO menuItems (name, category, price, description, image) values (?, ?, ?, ?, ?)`,
        [item.name, item.category, item.price, item.description, item.image],
        (insertResults) => console.log("Successful insertion"),
      ),
        (_, error) => console.log("data insertion error: ", error);
    });
  });
}

export const getCategories = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT DISTINCT category FROM menuItems`,
        [],
        (_, result) => {
          let categoriesArray = [];
          result.rows._array.forEach((item) =>
            categoriesArray.push(item.category),
          );
          resolve(categoriesArray.sort());
        },
        (_, error) => {
          console.error("DB read error: ", error);
          reject(error);
        },
      );
    });
  });
};

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    if (!query) {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from menuitems where ${activeCategories
            .map((category) => `category='${category}'`)
            .join(" or ")}`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
        );
      }, reject);
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from menuitems where (name like '%${query}%') and (${activeCategories
            .map((category) => `category='${category}'`)
            .join(" or ")})`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
        );
      }, reject);
    }
  });
}
