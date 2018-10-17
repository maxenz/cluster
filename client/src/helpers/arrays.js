const arrayToObject = (records, keyField) =>
    records.reduce((acc, record) => ({
      ...acc,
      [record[keyField]]: record,
    }), {});

export {
  arrayToObject,
}