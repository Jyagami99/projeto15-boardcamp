import connection from "../database/database.js";

export async function validateRental(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const customers = await connection.query(`SELECT * FROM customers;`);
    const customerIdVerify = customers.rows.find(
      (customer) => parseInt(customer.id) === parseInt(customerId)
    );

    if (!customerIdVerify) return res.sendStatus(400);

    const gameIdVerify = await connection.query(
      `SELECT * FROM games
      WHERE games.id = $1;`,
      [gameId]
    );

    if (gameIdVerify.rows.length === 0) return res.sendStatus(400);
    if (parseInt(daysRented) < 1) return res.sendStatus(400);

    const rentalsList = await connection.query(
      `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", categories.id AS "categoryId", categories.name AS "categoryName" 
      FROM rentals
      JOIN customers ON customers.id = rentals."customerId"
      JOIN games ON games.id = rentals."gameId"
      JOIN categories ON games."categoryId" = categories.id;`
    );
    const rentals = rentalsList.rows;

    function filterRentals(dataFromArray, query) {
      if (!query) return true;
      return dataFromArray === query;
    }
    const filteredRentals = rentals.filter((rental) =>
      filterRentals(rental.gameId, parseInt(gameId))
    );

    if (filteredRentals.length >= gameIdVerify.rows[0].stockTotal)
      return res.sendStatus(400);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function validateReturnDate(req, res, next) {
  const id = req.params.id;
  try {
    const rental = await connection.query(
      `SELECT rentals.*, games."pricePerDay" 
      FROM rentals
      JOIN games ON games.id = rentals."gameId"
      WHERE rentals.id = $1;`,
      [id]
    );

    if (rental.rows.length === 0) return res.sendStatus(404);
    if (rental.rows[0].returnDate) return res.sendStatus(400);

    res.locals.rental = rental;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
