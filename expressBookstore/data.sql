DROP DATABASE IF EXISTS booksdb;
CREATE DATABASE booksdb;

\c booksdb;

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

DROP DATABASE IF EXISTS booksdbtest;
CREATE DATABASE booksdbtest;

\c booksdbtest;

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