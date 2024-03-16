process.env.NODE_ENV = 'test';

const request = require("supertest");

const app = require("../app");
const db = require("../db");

const Book = require("../models/book");

beforeAll(async function () {
    await db.query(`
    DROP TABLE IF EXISTS books;

    CREATE TABLE books (
    isbn TEXT PRIMARY KEY,
    amazon_url TEXT,
    author TEXT,
    language TEXT, 
    pages INTEGER,
    publisher TEXT,
    title TEXT, 
    year INTEGER
    );
    `);
});

beforeEach(async function () {
    await db.query("DELETE FROM books");

    let b1 = await Book.create({
        isbn: "1234567890",
        amazon_url: "https://www.amazon.com",
        author: "Test1",
        language: "English",
        pages: 100,
        publisher: "Testy1",
        title: "Test1",
        year: 2020
    });
});

afterEach(async function () {
    await db.query("DELETE FROM books");
});

afterAll(async function () {
    await db.end();
}); 

describe ("Test Book Routes", function () {
    test("Get all books", async function () {
        let response = await request(app)
            .get("/books");
        expect(response.body.books.length).toBe(1);
    });

    test("Create a book", async function () {
        let response = await request(app)
            .post("/books")
            .send({
                isbn: "1234567891",
                amazon_url: "https://www.amazon.com",
                author: "Test2",
                language: "English",
                pages: 200,
                publisher: "Testy2",
                title: "Test2",
                year: 2021
            });
        expect(response.body.book.isbn).toBe("1234567891");
    }
    );

    test("Get a book", async function () {
        let response = await request(app)
            .get("/books/1234567890");
        expect(response.body.book.isbn).toBe("1234567890");
    }
    );

    test("Update a book", async function () {
        let response = await request(app)
            .put("/books/1234567890")
            .send({
                isbn: "1234567890",
                amazon_url: "https://www.amazon.com",
                author: "Test1",
                language: "Russian",
                pages: 100,
                publisher: "Testy1",
                title: "Test1",
                year: 2020
            });
        expect(response.body.book.title).toBe("Test1");
        expect(response.body.book.language).toBe("Russian");
    }
    );

    test("Update a book with invalid data", async function () {
        let response = await request(app)
            .put("/books/1234567890")
            .send({
                isbn: "1234567890",
                amazon_url: "https://www.amazon.com",
                author: "Test1",
                language: "Russian",
                pages: 100,
                publisher: "Testy1",
                title: "Test1",
                year: "2020"
            });
        expect(response.statusCode).toBe(400);
    }
    );

    test("Delete a book", async function () {
        let response = await request(app)
            .delete("/books/1234567890");
        expect(response.body.message).toBe("Book deleted");
    }
    );

}
);
