process.env.NODE_ENV = 'test';

const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");

beforeAll(async function () {
    await db.query(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS messages CASCADE;
    
    CREATE TABLE users (
        username text PRIMARY KEY,
        password text NOT NULL,
        first_name text NOT NULL,
        last_name text NOT NULL,
        phone text NOT NULL,
        join_at timestamp without time zone NOT NULL,
        last_login_at timestamp with time zone
    );
    
    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        from_username text NOT NULL REFERENCES users ON DELETE CASCADE,
        to_username text NOT NULL REFERENCES users ON DELETE CASCADE,
        body text NOT NULL,
        sent_at timestamp with time zone NOT NULL,
        read_at timestamp with time zone
    );
    
    `);
  });


beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");

    let u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });
  });

describe("Auth Routes Test", function () {

  /** POST /auth/register => token  */

  describe("POST /auth/register", function () {
    test("can register", async function () {
      let response = await request(app)
        .post("/auth/register")
        .send({
          username: "bob",
          password: "secret",
          first_name: "Bob",
          last_name: "Smith",
          phone: "+14150000000"
        });

      let token = response.body.token;
      expect(jwt.decode(token)).toEqual({
        username: "bob",
        iat: expect.any(Number)
      });
    });
  });

  /** POST /auth/login => token  */

  describe("POST /auth/login", function () {
    test("can login", async function () {
      let response = await request(app)
        .post("/auth/login")
        .send({ username: "test1", password: "password" });

      let token = response.body.token;
      expect(jwt.decode(token)).toEqual({
        username: "test1",
        iat: expect.any(Number)
      });
    });

    test("won't login w/wrong password", async function () {
      let response = await request(app)
        .post("/auth/login")
        .send({ username: "test1", password: "WRONG" });
      expect(response.statusCode).toEqual(400);
    });

    test("won't login w/wrong username", async function () {
      let response = await request(app)
        .post("/auth/login")
        .send({ username: "not-user", password: "password" });
      expect(response.statusCode).toEqual(400);
    });
  });
});

afterAll(async function () {
  await db.end();
});
