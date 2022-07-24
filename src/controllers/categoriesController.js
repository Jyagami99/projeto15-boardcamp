import connection from "../database/database.js";

export async function getCategories(req, res) {
  try {
    const { rows: categories } = await connection.query(
      `SELECT * FROM categories;`
    );
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function postCategory(req, res) {
  const { name } = req.body;
  try {
    const { rows: categories } = await connection.query(
      `INSERT INTO categories (name) VALUES ($1);`,
      [name]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
