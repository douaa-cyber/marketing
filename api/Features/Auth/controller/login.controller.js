const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../User/model/User");
const hostname = process.env.hostname;
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
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      domain: hostname,
      maxAge: 24 * 60 * 60 * 1000,
    });
    const userResponse = {
      id: user.id,
      username: user.username,
      role: user.role,
      fullname: user.fullname,
    };
    res.status(200).json({
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = login;
