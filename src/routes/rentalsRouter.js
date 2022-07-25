import { Router } from "express";
import {
  deleteRental,
  getRentals,
  postRentals,
  postRentalsById,
} from "../controllers/rentalsController.js";
import { validateRentals } from "../middlewares/rentalsMiddleware.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateRentals, postRentals);
router.post("/rentals/:id/return", validateRentals, postRentalsById);
router.delete("/rentals/:id", deleteRental);

export default router;
