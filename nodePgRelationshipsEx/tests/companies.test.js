// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const slugify = require('slugify');

let testInvoice;
let testCompany;

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
    const resultCompany = await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.')
        RETURNING *`);
    testCompany = resultCompany.rows[0];
    var code = testCompany.code;

    const resultInvoice = await db.query(`        
        INSERT INTO invoices (comp_code, amt, paid, paid_date)
        VALUES ('apple', 100, false, null)
        RETURNING *
    `);
    testInvoice = resultInvoice.rows[0];

    const resultIndustry = await db.query(`
        INSERT INTO industries (code, industry)
        VALUES ('tech', 'Technology')
        RETURNING *`);
    testIndustry = resultIndustry.rows[0];

    await db.query(`
        INSERT INTO company_industry (comp_code, ind_code)
        VALUES ('apple', 'tech')
        RETURNING *`);
    testCompany.industries = [testIndustry.code];
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

describe("GET /companies", () => {
    test("Get a list with one company", async () => {
        const res = await request(app).get('/companies');
        expect(res.statusCode).toBe(200);
        expect(res.body.companies).toHaveLength(1);
        expect(res.body).toEqual({
            companies: [
              {
                code: testCompany.code,
                name: testCompany.name,
                industries: testCompany.industries
              }
            ]
          });
    });
});

describe("GET /companies/:code", () => {
    test("Gets a single company", async () => {
        const res = await request(app).get(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            company: {
                code: testCompany.code,
                name: testCompany.name,
                description: testCompany.description,
                industries: testCompany.industries
            }
        });
    });
});

describe("POST /companies", () => {
    test("Creates a new company", async () => {
        const res = await request(app)
            .post('/companies')
            .send({code: 'microsoft', name: 'Microsoft', description: 'Maker of Windows.'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            company: {
                code: 'microsoft',
                name: 'Microsoft',
                description: 'Maker of Windows.'
            }
        });
    });
});

describe("PUT /companies/:code", () => {
    test("Updates a single company", async () => {
        const updatedCompanyData = {
            name: 'Apple Inc.',
            description: 'Maker of OSX.',
            industries: [{ code: "tech" }]
        };

        const res = await request(app)
            .put(`/companies/${testCompany.code}`)
            .send(updatedCompanyData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            company: {
                code: testCompany.code,
                name: updatedCompanyData.name,
                description: updatedCompanyData.description,
                industries: [updatedCompanyData.industries[0].code]
            }
        });
    });
});


describe("DELETE /companies/:code", () => {
    test("Deletes a single company", async () => {
        const res = await request(app).delete(`/companies/${testCompany.code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({status: "deleted"});
    });
});