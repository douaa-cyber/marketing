const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../User/model/User");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.unscoped().findOne({
      where: { username },
    });
    console.log(user);

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
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = login;
