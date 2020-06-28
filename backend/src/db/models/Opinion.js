import mongoose, { Schema } from "mongoose";

const opionionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },

  orderId: { type: Schema.Types.ObjectId, required: true },

  restaurantId: { type: Schema.Types.ObjectId, required: true },

  starRating: { type: Number, required: true },

  content: { type: String, required: false },
}, {
  timestamps: {
    createdAt: 'createdAt'
  }
});

const Opinion = mongoose.model("opinion", opionionSchema);

opionionSchema.virtual("order", {
  ref: "order",
  localField: "orderId",
  foreignField: "_id",
  justOne: true,
});

opionionSchema.virtual("restaurant", {
  ref: "restaurant",
  localField: "restaurantId",
  foreignField: "_id",
  justOne: true,
});

opionionSchema.virtual("user", {
  ref: "user",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

export default Opinion;
