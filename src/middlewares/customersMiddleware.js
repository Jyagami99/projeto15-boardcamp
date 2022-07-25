import connection from "../database/database.js";
import customerSchema from "../schemas/customerSchema.js";

export async function validateCustomer(req, res, next) {
  const id = req.params.id;
  const { cpf } = req.body;
  const validation = customerSchema.validate(req.body, { abortEarly: false });
  try {
    if (validation.error) return res.sendStatus(400);

    let isCpfRegistered;

    if (id) {
      isCpfRegistered = await connection.query(
        `SELECT * FROM customers
        WHERE customers.cpf = $2 AND customers.id != $1;`,
        [id, cpf]
      );
    } else {
      isCpfRegistered = await connection.query(
        `SELECT * FROM customers
        WHERE customers.cpf = $1;`,
        [cpf]
      );
    }

    if (isCpfRegistered.rows.length > 0) return res.sendStatus(409);

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}
