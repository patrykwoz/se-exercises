-- from the terminal run:
-- psql < air_traffic.sql

DROP DATABASE IF EXISTS air_traffic;

CREATE DATABASE air_traffic;

\c air_traffic

-- Create a table for countries
CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    country_name TEXT NOT NULL
);

-- Create a table for cities
CREATE TABLE cities (
    city_id SERIAL PRIMARY KEY,
    city_name TEXT NOT NULL,
    country_id INT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

-- Create a table for airlines
CREATE TABLE airlines (
    airline_id SERIAL PRIMARY KEY,
    airline_name TEXT NOT NULL
);

-- Create a table for customers
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL
);

-- Create a table for tickets
CREATE TABLE tickets (
    ticket_id SERIAL PRIMARY KEY,
    seat TEXT NOT NULL,
    departure TIMESTAMP NOT NULL,
    arrival TIMESTAMP NOT NULL,
    airline_id INT NOT NULL,
    from_city_id INT NOT NULL,
    to_city_id INT NOT NULL,
    customer_id INT NOT NULL,
    FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),
    FOREIGN KEY (from_city_id) REFERENCES cities(city_id),
    FOREIGN KEY (to_city_id) REFERENCES cities(city_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Now you can insert data into these tables. For example:

-- Insert countries
INSERT INTO countries (country_name) VALUES 
    ('United States'),
    ('Japan'),
    ('United Kingdom'),
    ('Mexico'),
    ('France'),
    ('Morocco'),
    ('UAE'),
    ('China'),
    ('Brazil'),
    ('Chile');

-- Insert data into cities table
INSERT INTO cities (city_name, country_id)
VALUES
    ('Washington DC', 1),
    ('Seattle', 1),
    ('Tokyo', 2),
    ('London', 3),
    ('Los Angeles', 1),
    ('Las Vegas', 1),
    ('Mexico City', 4),
    ('Paris', 5),
    ('Casablanca', 6),
    ('Dubai', 7),
    ('Beijing', 8),
    ('New York', 1),
    ('Charlotte', 1),
    ('Cedar Rapids', 1),
    ('Chicago', 1),
    ('New Orleans', 1),
    ('Sao Paolo', 9),
    ('Santiago', 10);

-- Insert data into airlines table
INSERT INTO airlines (airline_name)
VALUES
    ('United'),
    ('British Airways'),
    ('Delta'),
    ('TUI Fly Belgium'),
    ('Air China'),
    ('American Airlines'),
    ('Avianca Brasil');

-- Insert data into customers table
INSERT INTO customers (first_name, last_name)
VALUES
    ('Jennifer', 'Finch'),
    ('Thadeus', 'Gathercoal'),
    ('Sonja', 'Pauley'),
    ('Waneta', 'Skeleton'),
    ('Berkie', 'Wycliff'),
    ('Alvin', 'Leathes'),
    ('Cory', 'Squibbes');

-- Insert data into tickets table
INSERT INTO tickets
    (seat, departure, arrival, airline_id, from_city_id, to_city_id, customer_id)
VALUES
    ('33B', '2018-04-08 09:00:00', '2018-04-08 12:00:00', 1, 1, 2, 1),
    ('8A', '2018-12-19 12:45:00', '2018-12-19 16:15:00', 2, 3, 4, 2),
    ('12F', '2018-01-02 07:00:00', '2018-01-02 08:03:00', 3, 5, 6, 3),
    ('20A', '2018-04-15 16:50:00', '2018-04-15 21:00:00', 3, 2, 7, 1),
    ('23D', '2018-08-01 18:30:00', '2018-08-01 21:50:00', 4, 8, 9, 4),
    ('18C', '2018-10-31 01:15:00', '2018-10-31 12:55:00', 5, 10, 11, 2),
    ('9E', '2019-02-06 06:00:00', '2019-02-06 07:47:00', 1, 12, 13, 5),
    ('1A', '2018-12-22 14:42:00', '2018-12-22 15:56:00', 6, 14, 15, 6),
    ('32B', '2019-02-06 16:28:00', '2019-02-06 19:18:00', 6, 13, 16, 5),
    ('10D', '2019-01-20 19:30:00', '2019-01-20 22:45:00', 7, 17, 18, 7);

