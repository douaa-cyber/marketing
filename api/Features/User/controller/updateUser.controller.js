const bcrypt = require("bcrypt");
const User = require("../model/User");

const updateUser = async (req, res) => {
  try {
    const user = await User.unscoped().findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.update(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = updateUser;
