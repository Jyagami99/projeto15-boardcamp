import dayjs from "dayjs";
import connection from "../database/database.js";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;
  try {
    const rentalsList = await connection.query(
      `SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", categories.id AS "categoryId", categories.name AS "categoryName" 
      FROM rentals
      JOIN customers ON customers.id = rentals."customerId"
      JOIN games ON games.id = rentals."gameId"
      JOIN categories ON games."categoryId" = categories.id;`
    );
    let rentals = rentalsList.rows;
    const formatedRentals = [];

    for (let rental of rentals) {
      rental = {
        ...rental,
        customer: {
          id: rental.customerId,
          name: rental.customerName,
        },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName,
        },
      };
      delete rental.customerName;
      delete rental.gameName;
      delete rental.categoryId;
      delete rental.categoryName;
      formatedRentals.push(rental);
    }

    function filterRentals(dataFromArray, query) {
      if (!query) return true;
      return dataFromArray === query;
    }

    const filteredRentals = formatedRentals
      .filter((rental) =>
        filterRentals(rental.customerId, parseInt(customerId))
      )
      .filter((rental) => filterRentals(rental.gameId, parseInt(gameId)));

    res.send(filteredRentals);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const game = await connection.query(
      `SELECT games.*, categories.name AS "categoryName"
      FROM games
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE games.id = $1;`,
      [gameId]
    );
    const rentDate = dayjs(Date.now()).format();
    const originalPrice =
      parseInt(daysRented) * parseInt(game.rows[0].pricePerDay);

    connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function postRentalById(req, res) {
  const id = req.params.id;
  const { rental } = res.locals;
  const returnDate = dayjs(Date.now());
  try {
    const rentDate = dayjs(rental.rows[0].rentDate);
    const days = parseInt(returnDate.diff(dayjs(rentDate).format(), "day"));
    const pricePerDay = parseInt(rental.rows[0].pricePerDay);

    let delayFee;
    if (days - rental.rows[0].daysRented <= 0) {
      delayFee = 0;
    } else {
      delayFee = days * pricePerDay;
    }

    await connection.query(
      `UPDATE rentals 
      SET "returnDate" = $1, "delayFee" = $2
      WHERE rentals.id = $3;`,
      [returnDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function deleteRental(req, res) {
  const id = req.params.id;
  try {
    await connection.query(
      `DELETE FROM rentals
      WHERE rentals.id = $1;`,
      [id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
