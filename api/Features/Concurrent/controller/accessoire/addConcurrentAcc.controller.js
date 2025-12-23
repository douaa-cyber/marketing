const ConcurrentAccessoire = require("../../model/ConcurrentAccessoire");

const CreateConcurrentAcc = async (req, res) => {
  try {
    const { name } = req.body;

    const accessoire = await ConcurrentAccessoire.create({
      name,
    });

    return res.status(201).json(accessoire);
  } catch (error) {
    console.error("Create ConcurrentAccessoire error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateConcurrentAcc,
};
