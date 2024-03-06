const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const slugify = require('slugify');

// CREATE TABLE companies (
//     code text PRIMARY KEY,
//     name text NOT NULL UNIQUE,
//     description text
// );

// CREATE TABLE invoices (
//     id serial PRIMARY KEY,
//     comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
//     amt float NOT NULL,
//     paid boolean DEFAULT false NOT NULL,
//     add_date date DEFAULT CURRENT_DATE NOT NULL,
//     paid_date date,
//     CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
// );

// CREATE TABLE industries (
//     code text PRIMARY KEY,
//     industry text NOT NULL UNIQUE
// );

// CREATE TABLE company_industries (
//     comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
//     ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE,
//     PRIMARY KEY (comp_code, ind_code)
// );

// INSERT INTO companies
//   VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
//          ('ibm', 'IBM', 'Big blue.');

// INSERT INTO invoices (comp_Code, amt, paid, paid_date)
//   VALUES ('apple', 100, false, null),
//          ('apple', 200, false, null),
//          ('apple', 300, true, '2018-01-01'),
//          ('ibm', 400, false, null);

// INSERT INTO industries
//   VALUES ('tech', 'Technology'),
//          ('comp', 'Computers');

// INSERT INTO company_industries
//   VALUES ('apple', 'tech'),
//          ('apple', 'comp'),
//          ('ibm', 'tech');

//GET /industries
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, industry FROM industries`);
        return res.json({ industries: results.rows });
    } catch (e) {
        return next(e);
    }
});

//GET /industries/:code
router.get("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        if(!code) throw new ExpressError('Industry code required', 400);

        const indResults = await db.query(`SELECT code, industry FROM industries WHERE code = $1`, [code]);
        if (indResults.rows.length === 0) {
            throw new ExpressError(`No such industry: ${code}`, 404);
        }
        const industry = indResults.rows[0];

        const compResults = await db.query(`SELECT code, name, description FROM companies JOIN company_industry ON code=comp_code WHERE ind_code = $1`, [code]);
        if(compResults.rows.length !== 0){
            industry.companies = compResults.rows;
        }else{
            industry.companies = [];
        }
        
        return res.json({ industry: industry });
    } catch (e) {
        return next(e);
    }
});

//POST /industries
router.post("/", async (req, res, next) => {
    try {
        const { industry } = req.body;
        if (!industry) throw new ExpressError('Industry required', 400);
        let code = slugify(industry, { lower: true });
        const results = await db.query(`INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry]);
        return res.status(201).json({ industry: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;