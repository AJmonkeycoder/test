const mongoose = require("mongoose");

const machineSchema = mongoose.Schema(
  {
    ts: { type: String},
    machine_status: { type: Number },
    vibration: { type: Number },
  }
  
);

const Machine = mongoose.model("Machine", machineSchema);
module.exports = Machine;