import { Router } from "express";
import {
  getCustomerById,
  getCustomers,
  postCustomer,
  updateCustomer,
} from "../controllers/customersController.js";
import { validateCustomer } from "../middlewares/customersMiddleware.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", validateCustomer, postCustomer);
router.put("/customers/:id", validateCustomer, updateCustomer);

export default router;
