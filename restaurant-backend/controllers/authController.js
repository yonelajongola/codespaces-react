const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail, createUser } = require("../models/userModel");

async function register(req, res) {
  const { restaurantId, name, email, password, role } = req.body;

  if (!restaurantId || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({
    restaurantId,
    name,
    email,
    passwordHash,
    role
  });

  return res.status(201).json({
    id: user.id,
    restaurantId: user.restaurant_id,
    name: user.name,
    email: user.email,
    role: user.role
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      restaurantId: user.restaurant_id
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({ token, role: user.role });
}

module.exports = {
  register,
  login
};
