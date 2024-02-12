// db.js
const sql = require("mssql");
const { dbConfig } = require("./config");

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

module.exports = { pool, poolConnect };
