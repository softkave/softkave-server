const mongoose = require("mongoose");

const historySchema = {
  updatedAt: Number,
  updatedBy: mongoose.Schema.Types.ObjectId
}

module.exports = {
  historySchema
};