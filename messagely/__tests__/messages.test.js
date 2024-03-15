process.env.NODE_ENV = 'test';

const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");

beforeAll(async function() {
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
  let u2 = await User.register({
    username: "test2",
    password: "password",
    first_name: "Test2",
    last_name: "Testy2",
    phone: "+14155552222",
  });
  const result = await db.query(`SELECT * FROM users`);
  console.log(result.rows);
  
  let m1 = await Message.create({
    from_username: "test1",
    to_username: "test2",
    body: "u1-to-u2"
  });
  let m2 = await Message.create({
    from_username: "test2",
    to_username: "test1",
    body: "u2-to-u1"
  });
});

afterEach(async function () {
  await db.query("DELETE FROM messages");
  await db.query("DELETE FROM users");
  await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");
});

describe("Test Message class", function () {
  test("can create", async function () {

    let m = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "new"
    });

    expect(m).toEqual({
      id: expect.any(Number),
      from_username: "test1",
      to_username: "test2",
      body: "new",
      sent_at: expect.any(Date),
    });
  });

  // test("can mark read", async function () {
  //   let m = await Message.create({
  //     from_username: "test1",
  //     to_username: "test2",
  //     body: "new"
  //   });
  //   expect(m.read_at).toBe(undefined);

  //   Message.markRead(m.id);
  //   const result = await db.query("SELECT read_at from messages where id=$1",
  //       [m.id]);
  //   expect(result.rows[0].read_at).toEqual(expect.any(Date));
  // });

  // test("can get", async function () {
  //   let u = await Message.get(1);
  //   expect(u).toEqual({
  //     id: expect.any(Number),
  //     body: "u1-to-u2",
  //     sent_at: expect.any(Date),
  //     read_at: null,
  //     from_user: {
  //       username: "test1",
  //       first_name: "Test1",
  //       last_name: "Testy1",
  //       phone: "+14155550000",
  //     },
  //     to_user: {
  //       username: "test2",
  //       first_name: "Test2",
  //       last_name: "Testy2",
  //       phone: "+14155552222",
  //     },
  //   });
  // });
});

afterAll(async function() {
  await db.end();
});
