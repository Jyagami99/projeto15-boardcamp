import { Router } from "express";
import {
  getCustomerById,
  getCustomers,
  postCustomers,
  updateCustomer,
} from "../controllers/customersController.js";
import { validateCustomer } from "../middlewares/customersMiddleware.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", validateCustomer, postCustomers);
router.put("/customers/:id", validateCustomer, updateCustomer);

export default router;
