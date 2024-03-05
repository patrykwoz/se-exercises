const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

//GET /companies
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name FROM companies`);
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
        return res.json({ company: company });
    } catch (e) {
        return next(e);
    }
});

//POST /companies
router.post("/", async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        if (!code || !name) throw new ExpressError('Code and name required', 400);

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
        const { name, description } = req.body;
        if (!name) throw new ExpressError('Name required', 400);

        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, code]);
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