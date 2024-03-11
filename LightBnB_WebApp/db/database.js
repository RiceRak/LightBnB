const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
  .query(
    `SELECT *
    FROM users
    WHERE email = $1;`,
    [email.toLowerCase()]
  )
  .then((result) => {
    console.log(result.rows);
    return result.rows[0]; 
  })
  .catch((err) => {
    console.log(err.message);
    return null; 
  });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
  .query(
    `SELECT *
    FROM users
    WHERE id = $1;`,
    [id]
  )
  .then((result) => {
    console.log(result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.log(err.message);
    return null; 
  });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
  .query(
    `INSERT INTO users (name, password, email) 
    VALUES ($1, $2, $3) 
    RETURNING *;`,
    [user.name, user.password, user.email]
  )
  .then((result) => {
    console.log(result.row)
    return result.rows[0];
  })
  .catch((err) => {
    console.error('Error adding user:', err.message);
    throw err; 
  });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `SELECT reservations.id, properties.thumbnail_photo_url, properties.title, properties.cost_per_night, reservations.start_date, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;
    `, [guest_id, limit]
    )
    .then((result) => {
      console.log('reservations', result)
      return result.rows;
    })
    .catch((error) => {
      console.error('Error retrieving reservations:', error.message);
      throw error; 
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  return new Promise((resolve, reject) => {
 // set variables
  const queryParams = [];
  
  let queryString = `
  SELECT properties.*, AVG(property_reviews.rating) AS average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
`;

// filter by owner ID
if (options.owner_id) {
  queryParams.push(options.owner_id);
  queryString += `WHERE owner_id = $${queryParams.length} `;
}

// filter by city
if (options.city) {
  queryParams.push(`%${options.city}%`);
  queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} city LIKE $${queryParams.length} `;
}
  
// filter by price
if (options.minimum_price_per_night && options.maximum_price_per_night) {
  // if both minimum and maximum price are provided
  queryParams.push(options.minimum_price_per_night * 100);
  queryParams.push(options.maximum_price_per_night * 100);
  queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} `;
} else if (options.minimum_price_per_night) {
  // if only minimum price is provided
  queryParams.push(options.minimum_price_per_night * 100);
  queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length} `;
} else if (options.maximum_price_per_night) {
  // if only maximum price is provided
  queryParams.push(options.maximum_price_per_night * 100);
  queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} cost_per_night <= $${queryParams.length} `;
}

// fliter by rating
if (options.minimum_rating) {
  queryParams.push(options.minimum_rating);
  queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} property_reviews.rating >= $${queryParams.length} `;
}

    // Add LIMIT
    queryParams.push(limit);
    queryString += `
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
    `;

    console.log(queryString, queryParams);

    pool.query(queryString, queryParams)
      .then((res) => resolve(res.rows))
      .catch((err) => reject(err));
  });

};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property, req) {
  return new Promise((resolve, reject) => {

    const sessionCookie = req.cookies.session;
    if (!sessionCookie) {
      reject(new Error('User is not logged in.'));
      return;
    }


    const userId = extractUserIdFromSessionCookie(sessionCookie);

    const queryString = `
      INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;
    const queryParams = [
      userId, // Use the userId extracted from the sessionCookie
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.street,
      property.city,
      property.province,
      property.post_code,
      property.country,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms
    ];

    pool.query(queryString, queryParams)
      .then((res) => resolve(res.rows[0])) // Return the saved property
      .catch((err) => reject(err));
  });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
