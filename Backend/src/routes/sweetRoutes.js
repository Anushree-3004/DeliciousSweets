const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  addSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} = require("../controller/sweetController");

const router = express.Router();

// All sweets/inventory endpoints are protected
router.use(authMiddleware);

router.post("/", addSweet);
router.get("/", getSweets);
router.get("/search", searchSweets);
router.put("/:id", updateSweet);
router.delete("/:id", adminMiddleware, deleteSweet);

router.post("/:id/purchase", purchaseSweet);
router.post("/:id/restock", adminMiddleware, restockSweet);

module.exports = router;