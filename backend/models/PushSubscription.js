const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subscription: Object
});

module.exports = mongoose.model("PushSubscription", pushSubscriptionSchema);
