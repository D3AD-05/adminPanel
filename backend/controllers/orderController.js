// const { pool, poolConnect } = require("../db");

// exports.getAllUsers = async (req, res) => {
//   try {
//     await poolConnect;
//     const request = pool.request();
//     const result = await request.query("SELECT * FROM orderDetail");
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("Error executing query:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while executing the query" });
//   }
// };
