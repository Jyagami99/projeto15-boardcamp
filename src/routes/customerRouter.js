import { Router } from "express";
import {
  getCustomerById,
  getCustomers,
  postCustomers,
  updateCustomer,
} from "../controllers/customersController.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", postCustomers);
router.put("/customers/:id", updateCustomer);

export default router;
