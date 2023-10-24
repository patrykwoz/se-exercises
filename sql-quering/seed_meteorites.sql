-- from the terminal run:
-- psql < seed.sql

DROP DATABASE IF EXISTS nasa;

CREATE DATABASE nasa;

\c nasa

CREATE TABLE meteorites
(
    name TEXT, -- character type is represented as TEXT in PostgreSQL
    id DOUBLE PRECISION, -- double type in PostgreSQL
    name_type TEXT CHECK (LOWER(name_type) IN ('valid', 'relict')),
    class TEXT,
    mass DOUBLE PRECISION,
    fall TEXT CHECK (fall IN ('Fell', 'Found')), -- Assuming only two values 'Fell' or 'Found'
    year INTEGER,
    lat TEXT,
    long TEXT,
    geolocation TEXT
);

-- Seeding the data from meteorites.csv into the meteorites table
\COPY meteorites FROM 'dataset/processed_meteorites.csv' DELIMITER ',' CSV HEADER;

--Preprocess to remove NA and other incorrect characters--
--sed 's/,NA,/,NULL,/g' dataset/meteorites.csv > dataset/processed_meteorites.csv--
--The data would require a lot more clean up than the above NA to NULL so switched LAT and LONG to text instead--