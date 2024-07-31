const namespaceModel = require("../../models/Chat");

exports.getAll = async (req, res, next) => {
  try {
    const namespaces = await namespaceModel.find({}, { rooms: 0 }).lean();
    return res.status(200).json(namespaces);
  } catch (error) {
    next(error);
  }
};
exports.createNamespace = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
exports.createRoom = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
