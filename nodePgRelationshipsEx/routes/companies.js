const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const slugify = require('slugify');

//GET /companies
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name FROM companies`);
        for(const company of results.rows) {
            const indResults = await db.query(`SELECT ind_code FROM company_industry WHERE comp_code = $1`, [company.code]);
            company.industries = indResults.rows.map(i => i.ind_code);
        }
        return res.json({ companies: results.rows });
    } catch (e) {
        return next(e);
    }
});

//GET /companies/:code
router.get("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        if(!code) throw new ExpressError('Company code required', 400);

        const compResults = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [code]);
        if (compResults.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        }
        const company = compResults.rows[0];
        const indResults = await db.query(`SELECT ind_code FROM company_industry WHERE comp_code = $1`, [code]);
        company.industries = indResults.rows.map(i => i.ind_code);
        return res.json({ company: company });
    } catch (e) {
        return next(e);
    }
});

//POST /companies
router.post("/", async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) throw new ExpressError('Code and name required', 400);
        let code = slugify(name, { lower: true });
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json({ company: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});

//PUT /companies/:code
router.put("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description, industries } = req.body;
        if (!name) throw new ExpressError('Name required', 400);

        if (!Array.isArray(industries)) throw new ExpressError('Industries must be an array', 400);
        if(industries.length === 0) throw new ExpressError('At least one industry is required', 400);

        for(const industry of industries) {
            let industryCode = industry.code;
            const check = await db.query(`SELECT * FROM company_industry WHERE comp_code=$1 AND ind_code=$2`, [code, industryCode]);
            if(check.rows.length === 0) {
                await db.query(`INSERT INTO company_industry (comp_code, ind_code) VALUES ($1, $2)`, [code, industryCode]);
            }
        }

        const results = await db.query(`
            UPDATE companies SET name=$1, description=$2
            WHERE code=$3
            RETURNING code, name, description`, [name, description, code]);

        const companyIndustries  = await db.query(`
            SELECT ind_code FROM company_industry
            WHERE comp_code=$1`, [code]);
        results.rows[0].industries = companyIndustries.rows.map(i => i.ind_code);
                
        if (results.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        }
        return res.json({ company: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});

//DELETE /companies/:code
router.delete("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;

        const results = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING code`, [code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        }
        return res.json({ status: "deleted" });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;