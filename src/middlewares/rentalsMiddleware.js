import connection from "../database/database.js";

export async function validateRentals(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const { rows: customers } = await connection.query(`
    SELECT * FROM customers;`);
    const customerIdVerify = customers.find(
      (customer) => parseInt(customer.id) === parseInt(customerId)
    );

    if (!customerIdVerify) return res.sendStatus(400);

    const { rows: gameIdVerify } = await connection.query(
      `
    SELECT * FROM games
    WHERE games.id = $1;`,
      [gameId]
    );

    if (gameIdVerify.length === 0) return res.sendStatus(400);
    if (parseInt(daysRented) < 1) return res.sendStatus(400);

    const { rows: rentalsList } = await connection.query(`
    SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", categories.id AS "categoryId", categories.name AS "categoryName" 
    FROM rentals
    JOIN customers ON customers.id = rentals."customerId"
    JOIN games ON games.id = rentals."gameId"
    JOIN categories ON games."categoryId" = categories.id;`);

    function filterRentals(dataFromArray, query) {
      if (!query) return true;
      return dataFromArray === query;
    }
    const filteredRentals = rentalsList.filter((rental) =>
      filterRentals(rental.gameId, parseInt(gameId))
    );

    if (filteredRentals.length >= gameIdVerify[0].stockTotal)
      return res.sendStatus(400);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
