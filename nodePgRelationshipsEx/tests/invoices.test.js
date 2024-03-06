// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testInvoice;

beforeAll(async () => {
    await db.query(`
        DROP TABLE IF EXISTS invoices CASCADE;
        DROP TABLE IF EXISTS companies CASCADE;
        DROP TABLE IF EXISTS industries CASCADE;
        DROP TABLE IF EXISTS company_industry CASCADE;
        
        CREATE TABLE companies (
            code text PRIMARY KEY,
            name text NOT NULL UNIQUE,
            description text
        );
        
        CREATE TABLE invoices (
            id serial PRIMARY KEY,
            comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
            amt float NOT NULL,
            paid boolean DEFAULT false NOT NULL,
            add_date date DEFAULT CURRENT_DATE NOT NULL,
            paid_date date,
            CONSTRAINT invoices_amt_check CHECK (amt > 0)
        );

        CREATE TABLE industries (
            code text PRIMARY KEY,
            industry text NOT NULL UNIQUE
        );
        
        CREATE TABLE company_industry (
            comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
            ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE,
            PRIMARY KEY (comp_code, ind_code)
        );
    `);
});

beforeEach(async () => {
    const resultCompany = await db.query(`INSERT INTO companies
    VALUES ('apple', 'Apple Computer', 'Maker of OSX.')`);

    const resultInvoice = await db.query(`        
        INSERT INTO invoices (comp_code, amt, paid, paid_date)
        VALUES ('apple', 100, false, null)
        RETURNING *
    `);
    testInvoice = resultInvoice.rows[0];
});

afterEach(async () => {
    await db.query(`DELETE FROM invoices`);
    await db.query(`DELETE FROM companies`);
    await db.query(`DELETE FROM industries`);
    await db.query(`DELETE FROM company_industry`);
});

afterAll(async () => {
    await db.end();
});

describe("GET /invoices", () => {
    test("Get a list with one invoice", async () => {
        const res = await request(app).get('/invoices');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoices: [
              {
                comp_code: testInvoice.comp_code,
                id: testInvoice.id,
              }
            ]
          });
    });
});

describe("GET /invoices/:id", () => {
    test("Gets a single invoice", async () => {
        const res = await request(app).get(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoice: {
                id: testInvoice.id,
                comp_code: testInvoice.comp_code,
                amt: testInvoice.amt,
                paid: testInvoice.paid,
                add_date: expect.any(String),
                paid_date: testInvoice.paid_date
            }
        });
    });
    test("Responds with 404 for invalid id", async () => {
        const res = await request(app).get(`/invoices/0`);
        expect(res.statusCode).toBe(404);
    });
});

describe("POST /invoices", () => {
    test("Creates a single invoice", async () => {
        const res = await request(app).post('/invoices').send({ comp_code: 'apple', amt: 100 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            invoice: {
                id: expect.any(Number),
                comp_code: 'apple',
                amt: 100,
                paid: false,
                add_date: expect.any(String),
                paid_date: null
            }
        });
    });
});

describe("PUT /invoices/:id", () => {
    test("Updates a single invoice", async () => {
        const res = await request(app).put(`/invoices/${testInvoice.id}`).send({ amt: 200, paid: true });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoice: {
                id: testInvoice.id,
                comp_code: testInvoice.comp_code,
                amt: 200,
                paid: true,
                add_date: expect.any(String),
                paid_date: expect.any(String)
            }
        });
    });
    test("Responds with 404 for invalid id", async () => {
        const res = await request(app).put(`/invoices/0`).send({ amt: 200, paid: true });
        expect(res.statusCode).toBe(400);
    });
});

describe("DELETE /invoices/:id", () => {
    test("Deletes a single invoice", async () => {
        const res = await request(app).delete(`/invoices/${testInvoice.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ status: 'deleted' });
    });
});