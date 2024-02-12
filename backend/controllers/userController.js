// controllers/userController.js
const { pool, poolConnect } = require("../db");

exports.createUser = async (req, res) => {
  try {
    const sql = `INSERT INTO userDetails (User_Name, [User_PhoneNo]) VALUES ('${req.body.name}', '${req.body.phoneNo}')`;
    await poolConnect;
    const request = pool.request();
    await request.query(sql);
    res.json({ message: "User added successfully" });
  } catch (err) {
    console.error("Error executing query:", err);
    res
      .status(500)
      .json({ error: "An error occurred while executing the query" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    await poolConnect;
    const request = pool.request();
    const result = await request.query("SELECT * FROM usertable");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error executing query:", err);
    res
      .status(500)
      .json({ error: "An error occurred while executing the query" });
  }
};
