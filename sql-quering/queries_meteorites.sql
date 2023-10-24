SELECT class, AVG(mass) as average_mass
FROM meteorites
GROUP BY class
ORDER BY average_mass DESC;

SELECT name, class, AVG(mass) as average_mass
FROM meteorites
WHERE class ILIKE '%Iron%'
GROUP BY name, class
ORDER BY average_mass DESC;

SELECT name, class, AVG(mass) as average_mass
FROM meteorites
WHERE class ILIKE '%Iron%' AND name ILIKE '%New_York%'
GROUP BY name, class
ORDER BY average_mass DESC;
