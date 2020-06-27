import express from "express";
import { withAsyncRequestHandler } from "../common/utils";
import Opinion from "../db/models/Opinion";
import { tokenValidatorMW } from "../auth/validators";

const OpinionRouter = express.Router();

OpinionRouter.post("/", tokenValidatorMW, async (req, res) => {
  withAsyncRequestHandler(res, async () => {
    await Opinion.create({
      userId: req.identity.id,
      restaurantId: req.body.restaurantId,
      orderId: req.body.orderId,
      starRating: req.body.starRating,
      content: req.body.content,
    });

    res.sendStatus(200);
  });
});

OpinionRouter.get("/", async (req, res) => {
  withAsyncRequestHandler(res, async () => {
    const opinions = await Opinion.find({
      restaurantId: req.query.restaurantId,
    });

    res.status(200).json(opinions);
  });
});

export default OpinionRouter;
