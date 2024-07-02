import { BadRequestError } from "../middleware/expressError.js";

/**
 * Helper for making selective update queries.
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param {Object} dataToUpdate - {field1: newVal, field2: newVal, ...}
 * @param {Object} jsToSql - Maps JS-style data fields to database column names,
 *                           like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} { sqlSetCols, dataToUpdate }
 * @example
 *   { firstName: 'Maya', age: 34 } =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0)
    throw new BadRequestError("No data provided for update");
  // { firstName: 'Maya', age: 34 } => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

export { sqlForPartialUpdate };
