const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const ExpressError = require("./expressError")
const app = express();
const {mean, median, mode} = require('./operations');
const {appendJSON} = require('./helpers');

app.use(express.json());

app.get('/mean', function(req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError("You must pass a query parameter of nums with a comma-separated list of numbers.", 400);
    }
    let nums = req.query.nums.split(',');
    
    for (let num of nums) {
        if (isNaN(num)) {
        throw new ExpressError(`"${num}" is not a number.`, 400);
        }
    }
    nums = nums.map(num => parseFloat(num));
    let result = {
        operation: "mean",
        result: mean(nums)
    }
    return res.json(result);
    });

app.get('/median', function(req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError("You must pass a query parameter of nums with a comma-separated list of numbers.", 400);
    }
    let nums = req.query.nums.split(',');
    for (let num of nums) {
        if (isNaN(num)) {
        throw new ExpressError(`"${num}" is not a number.`, 400);
        }
    }
    nums = nums.map(num => parseFloat(num));
    let result = {
        operation: "median",
        result: median(nums)
    }
    return res.json(result);
    });

app.get('/mode', function(req, res, next) {
    if (!req.query.nums) {
        throw new ExpressError("You must pass a query parameter of nums with a comma-separated list of numbers.", 400);
    }
    let nums = req.query.nums.split(',');
    for (let num of nums) {
        if (isNaN(num)) {
        throw new ExpressError(`"${num}" is not a number.`, 400);
        }
    }
    nums = nums.map(num => parseFloat(num));
    let result = {
        operation: "mode",
        result: mode(nums)
    }
    return res.json(result);
    });

app.get('/all', function(req, res, next) {
    try {
        if (!req.query.nums || !req.query.nums.trim()) {
            throw new ExpressError("You must pass a non-empty query parameter 'nums' with a comma-separated list of numbers.", 400);
        }

        const nums = req.query.nums.split(',').map(num => {
            const parsedNum = parseFloat(num.trim());
            if (isNaN(parsedNum)) {
                throw new ExpressError(`"${num.trim()}" is not a valid number.`, 400);
            }
            return parsedNum;
        });

        const result = {
            operation: "all",
            mean: mean(nums),
            median: median(nums),
            mode: mode(nums)
        };

        if (req.query.save === "true") {
            filename = "results.json";
            appendJSON(filename, result);
        }

        return res.json(result);
    } catch (error) {
        return next(error);
    }
});
    

//error handlers
app.use(function (req, res, next) {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError)
});

app.use(function(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: {message, status}
  });
});

app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});

