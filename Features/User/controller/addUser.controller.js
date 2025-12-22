const bcrypt = require("bcrypt");
const User = require("../model/User");

const signup = async (req, res) => {
  try {
    const { username, fullname, password, role } = req.body;

    const exists = await User.unscoped().findOne({
      where: { username },
    });

    if (exists) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      fullname,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = signup;
