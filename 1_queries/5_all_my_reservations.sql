SELECT reservations.id, properties.title, properties.cost_per_night, reservations.start_date, AVG(property_reviews.rating) AS average_rating
FROM users
JOIN reservations ON guest_id = users.id
JOIN properties ON property_id = properties.id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE users.id = 1
GROUP BY reservations.id, properties.title, properties.cost_per_night, reservations.start_date
ORDER BY start_date
LIMIT 10;