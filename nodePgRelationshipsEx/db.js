/** Database setup for BizTime. */
const { Client } = require("pg");

const DB_USER = "postgres";
const DB_PASSWORD = "postgres";

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/biztime_test`;
} else {
  DB_URI = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/biztime`;
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db