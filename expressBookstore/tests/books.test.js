process.env.NODE_ENV = 'test';

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


describe ("Test Book model", function () {
    test("Create a book", async function () {
        let b2 = await Book.create({
            isbn: "1234567891",
            amazon_url: "https://www.amazon.com",
            author: "Test2",
            language: "English",
            pages: 200,
            publisher: "Testy2",
            title: "Test2",
            year: 2021
        });
        expect(b2.isbn).toBe("1234567891");
    }
    );
    test("Get all books", async function () {
        let books = await Book.findAll();
        expect(books.length).toBe(1);
    }
    );
    test("Get a book", async function () {
        let book = await Book.findOne("1234567890");    
        expect(book.isbn).toBe("1234567890");
    }
    );
    test("Update a book", async function () {
        let book = await Book.update("1234567890", {
            amazon_url: "https://www.amazon.com",
            author: "Test1",    
            language: "English",
            pages: 100,
            publisher: "Testy1",
            title: "Test1",
            year: 2020
        });
        expect(book.title).toBe("Test1");
    }
    );  
    test("Delete a book", async function () {
        let book = await Book.remove("1234567890");
        expect(book).not.toBeDefined();
    }
    );
}
);

