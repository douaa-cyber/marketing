const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../User/model/User");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.unscoped().findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      expiresIn: 3600,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = login;
