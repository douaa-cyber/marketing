const { createForm } = require("./addForm.controller");
const {
  getAllForms,
  getFormById,
  getLastVisiteDetail,
} = require("./getForm.controller");
const { updateForm } = require("./updateForm.controller");
const { deleteForm } = require("./deleteForm.controller");
module.exports = {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
  getLastVisiteDetail,
};
