const Sweet = require("../models/Sweet");

function parsePositiveInt(raw, fieldName) {
  const n = Number(raw);

  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    return { error: `${fieldName} must be a positive integer` };
  }

  return { value: n };
}

function parseNonNegativeInt(raw, fieldName) {
  const n = Number(raw);

  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
    return { error: `${fieldName} must be a non-negative integer` };
  }

  return { value: n };
}

function parseNonNegativeNumber(raw, fieldName) {
  const n = Number(raw);

  if (!Number.isFinite(n) || n < 0) {
    return { error: `${fieldName} must be a non-negative number` };
  }

  return { value: n };
}

function parsePurchaseQuantity(req) {
  const raw = req.body && req.body.quantity !== undefined ? req.body.quantity : 1;
  return parsePositiveInt(raw, "quantity");
}

async function addSweet(req, res, next) {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ message: "name, category, price, quantity are required" });
    }

    const parsedPrice = parseNonNegativeNumber(price, "price");
    if (parsedPrice.error) return res.status(400).json({ message: parsedPrice.error });

    const parsedQty = parseNonNegativeInt(quantity, "quantity");
    if (parsedQty.error) return res.status(400).json({ message: parsedQty.error });

    const sweet = await Sweet.create({
      name,
      category,
      price: parsedPrice.value,
      quantity: parsedQty.value,
    });

    return res.status(201).json(sweet);
  } catch (err) {
    return next(err);
  }
}

async function getSweets(req, res, next) {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    return res.json(sweets);
  } catch (err) {
    return next(err);
  }
}

async function searchSweets(req, res, next) {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (name) {
      filter.name = { $regex: String(name), $options: "i" };
    }

    if (category) {
      filter.category = { $regex: String(category), $options: "i" };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        const parsed = parseNonNegativeNumber(minPrice, "minPrice");
        if (parsed.error) return res.status(400).json({ message: parsed.error });
        filter.price.$gte = parsed.value;
      }

      if (maxPrice !== undefined) {
        const parsed = parseNonNegativeNumber(maxPrice, "maxPrice");
        if (parsed.error) return res.status(400).json({ message: parsed.error });
        filter.price.$lte = parsed.value;
      }
    }

    const sweets = await Sweet.find(filter).sort({ createdAt: -1 });
    return res.json(sweets);
  } catch (err) {
    return next(err);
  }
}

async function updateSweet(req, res, next) {
  try {
    const { id } = req.params;

    const updates = {};
    const allowed = ["name", "category", "price", "quantity"];

    for (const key of allowed) {
      if (req.body[key] === undefined) continue;

      if (key === "price") {
        const parsed = parseNonNegativeNumber(req.body[key], "price");
        if (parsed.error) return res.status(400).json({ message: parsed.error });
        updates.price = parsed.value;
        continue;
      }

      if (key === "quantity") {
        const parsed = parseNonNegativeInt(req.body[key], "quantity");
        if (parsed.error) return res.status(400).json({ message: parsed.error });
        updates.quantity = parsed.value;
        continue;
      }

      updates[key] = req.body[key];
    }

    const sweet = await Sweet.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    return res.json(sweet);
  } catch (err) {
    return next(err);
  }
}

async function deleteSweet(req, res, next) {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    return res.json({ message: "Sweet deleted" });
  } catch (err) {
    return next(err);
  }
}

async function purchaseSweet(req, res, next) {
  try {
    const { id } = req.params;
    const parsed = parsePurchaseQuantity(req);
    if (parsed.error) return res.status(400).json({ message: parsed.error });

    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    if (sweet.quantity < parsed.value) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    sweet.quantity -= parsed.value;
    await sweet.save();

    return res.json(sweet);
  } catch (err) {
    return next(err);
  }
}

async function restockSweet(req, res, next) {
  try {
    const { id } = req.params;
    const parsed = parsePurchaseQuantity(req);
    if (parsed.error) return res.status(400).json({ message: parsed.error });

    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    sweet.quantity += parsed.value;
    await sweet.save();

    return res.json(sweet);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
};