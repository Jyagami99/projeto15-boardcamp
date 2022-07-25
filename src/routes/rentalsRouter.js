import { Router } from "express";
import {
  deleteRental,
  getRentals,
  postRental,
  postRentalById,
} from "../controllers/rentalsController.js";
import {
  validateRental,
  validateReturnDate,
} from "../middlewares/rentalsMiddleware.js";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", validateRental, postRental);
router.post("/rentals/:id/return", validateReturnDate, postRentalById);
router.delete("/rentals/:id", validateReturnDate, deleteRental);

export default router;
