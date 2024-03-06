const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");

// GET /invoices
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invoices: results.rows });
    } catch (e) {
        return next(e);
    }
});

// GET /invoices/:id
router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id) throw new ExpressError('Invoice id required', 400);

        const invResults = await db.query(`SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices WHERE id = $1`, [id]);
        if (invResults.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        }
        const invoice = invResults.rows[0];
        return res.json({ invoice: invoice });
    } catch (e) {
        return next(e);
    }
});

// POST /invoices
router.post("/", async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        if (!comp_code || !amt) throw new ExpressError('Company code and amount required', 400);

        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        return res.status(201).json({ invoice: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});

// PUT /invoices/:id
router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        
        if(!id || id<=0) throw new ExpressError('Invoice id required', 400);

        const { amt, paid } = req.body;
        if (!amt || !paid) throw new ExpressError('Amount required', 400);
        
        let results;
        let currentPaymentStatus = await db.query(`SELECT paid FROM invoices WHERE id = $1`, [id]);
        if (paid===true && currentPaymentStatus.rows[0].paid===false) {
            //If paying unpaid invoice: sets paid_date to today
            results = await db.query(`
            UPDATE invoices SET amt=$1, paid=$2, paid_date=CURRENT_DATE 
            WHERE id=$3 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, id]);
        } else if (paid===false && currentPaymentStatus.rows[0].paid===true) {
            //If un-paying: sets paid_date to null
            results = await db.query(`
            UPDATE invoices SET amt=$1, paid=$2, paid_date=null 
            WHERE id=$3 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, id]);
        } else {
            //If no change to payment status: just updates the amount
            results = await db.query(`
            UPDATE invoices SET amt=$1, paid=$2
            WHERE id=$3 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, id]);
        }   
        
        if (results.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        }
        return res.json({ invoice: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});

// DELETE /invoices/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const results = await db.query(`DELETE FROM invoices WHERE id=$1 RETURNING id`, [id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        }
        return res.json({ status: "deleted" });
    } catch (e) {
        return next(e);
    }
});

// GET /invoices/companies/:code
router.get("/companies/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        if(!code) throw new ExpressError('Company code required', 400);

        const compResults = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [code]);
        if (compResults.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        }
        const company = compResults.rows[0];

        const invResults = await db.query(`SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices WHERE comp_code = $1`, [code]);
        company.invoices = invResults.rows;
        return res.json({ company: company });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;