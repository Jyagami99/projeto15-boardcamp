import connection from "../database/database.js";

export async function validateGame(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  try {
    const { rows: idVerify } = await connection.query(
      `
      SELECT * FROM categories
      WHERE ID=$1;
      `,
      [categoryId]
    );

    if (!name || stockTotal <= 0 || pricePerDay <= 0 || idVerify.length === 0)
      return res.sendStatus(400);

    const { rows: nameVerify } = await connection.query(
      `
      SELECT * FROM games
      WHERE name = $1;`,
      [name]
    );

    if (nameVerify.length > 0) return res.sendStatus(409);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
