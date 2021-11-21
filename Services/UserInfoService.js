const {
  userInfoSchema,
  updateCalorieSchema,
  NameandMailSchema,
} = require("../Shared/Schema");
const db = require("../Shared/Mongo");
const { ObjectId } = require("mongodb");

const service = {
  async getuserDetails(req, res) {
    try {
      const data = await db.userinfo.findOne({ userId: req.user.userId });
      res.status(200).send(data);
    } catch (err) {
      res.status(500).send({ error: "server error" });
    }
  },

  //create details
  async createUserInfo(req, res) {
    try {
      //schema validation
      let { error, value } = await userInfoSchema.validate(req.body);
      if (error) {
        return res.status(401).send({ error: error.details[0].message });
      }
      //check info exists
      const user = await db.userinfo.findOne({ userId: req.user.userId });
      if (user) {
        return res
          .status(401)
          .send({ error: "userinfo exists try to update user" });
      }

      let date = new Date().toDateString();
      //inserting in database
      const data = await db.userinfo.insertOne({
        ...value,
        date,
        calories: 0,
        water: 0,
        track: [],
        food: [],
        userId: req.user.userId,
        userName: req.user.userName,
        email: req.user.email,
      });
      res.status(200).send({ success: "userinfo created" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: "server error" });
    }
  },

  //if user wants to change the diet plan
  async changeUserInfo(req, res) {
    try {
      //schema validation
      let { error, value } = await userInfoSchema.validate(req.body);
      if (error) {
        return res.status(401).send({ error: error.details[0].message });
      }

      //user verify for authorisation
      const user = await db.userinfo.findOne({
        _id: ObjectId(req.params.id),
        userId: req.user.userId,
      });
      if (!user) {
        return res.status(401).send({ error: "you don't have access" });
      }

      //update data
      let date = new Date().toDateString();
      const data = await db.userinfo.findOneAndUpdate(
        { userId: req.user.userId, _id: ObjectId(req.params.id) },
        {
          $set: { ...value, date, calories: 0, water: 0, track: [], food: [] },
        },
        { returnDocument: "after" }
      );

      res.send(data.value);
    } catch (err) {
      res.status(500).send({ error: "server error" });
    }
  },
};

module.exports = service;
