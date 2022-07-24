import connection from "../database/database.js";

export async function validateCategory(req, res, next) {
  try {
    if (!req.body.name) return res.sendStatus(400);
    const { rows: category } = await connection.query(
      `SELECT * FROM categories WHERE name=$1;`,
      [req.body.name]
    );
    if (category.length > 0) return res.sendStatus(409);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
