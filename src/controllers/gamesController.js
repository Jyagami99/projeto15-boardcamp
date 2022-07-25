import connection from "../database/database.js";

export async function getGames(req, res) {
  const name = req.query.name;
  let games;
  try {
    if (!name) {
      games = await connection.query(
        `SELECT games.*, categories.name AS "categoryName"
        FROM games
        JOIN categories
        ON games."categoryId" = categories.id;`
      );
    } else {
      games = await connection.query(
        `SELECT games.*, categories.name AS "categoryName"
        FROM games
        JOIN categories
        ON games."categoryId" = categories.id
        WHERE games.name ILIKE $1;`,
        [name + "%"]
      );
    }
    res.send(games.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function postGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  try {
    connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1, $2, $3, $4, $5);`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
