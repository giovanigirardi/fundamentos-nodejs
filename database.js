import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      }).catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    const data = this.#database[table] ?? [];

    if (!search) {
      return data;
    }

    const filteredData = data.filter((row) => {
      return Object.entries(search).some(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase());
      })
    })

    return filteredData;
  }

  insert(table, data) {
    if (!this.#database[table]) {
      this.#database[table] = [];
    }

    this.#database[table].push(data);
    this.#persist();

    return data;
  }

  delete(table, id) {
    if (!this.#database[table]) {
      return false;
    }

    const rowIndex = this.#database[table].findIndex((data) => data.id === id);

    if (rowIndex === -1) {
      return false;
    }

    this.#database[table].splice(rowIndex, 1);
    this.#persist();

    return true;
  }

  update(table, id, data) {
    if (!this.#database[table]) {
      return false;
    }

    const rowIndex = this.#database[table].findIndex((data) => data.id === id);

    if (rowIndex === -1) {
      return false;
    }

    this.#database[table][rowIndex] = { ...this.#database[table][rowIndex], ...data };
    this.#persist();

    return true;
  }
}