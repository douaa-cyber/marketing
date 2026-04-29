const Concurrent = require("../../model/Concurrent");

const CreateConcurrent = async (req, res) => {
  try {
    const { name, categorieId } = req.body;

    const concurrent = await Concurrent.create({ name });

    if (categorieId) {
      await concurrent.addCategorie(categorieId);
    }

    return res.status(201).json(concurrent);
  } catch (error) {
    console.error("Create ConcurrentAccessoire error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateConcurrent,
};
