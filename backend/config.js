const sql = require("mssql/msnodesqlv8");

const config = {
  user: "sa",
  password: "P@SSW0RD",
  server: "DESKTOP-1BUSMKO\\MSSQLSERVER1",
  database: "Order_Managment",
  port: 8081,
};
const pool = new sql.ConnectionPool(config);

module.exports = pool;
