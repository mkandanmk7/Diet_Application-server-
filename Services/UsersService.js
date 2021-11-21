const {
  userSchema,
  loginSchema,
  passResetSchema,
  newPassSchema,
} = require("../Shared/Schema");
const db = require("../Shared/Mongo");
const bcrypt = require("bcrypt");
const sendMail = require("./SendMail");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const service = {
  //register
  async registerUser(req, res) {
    try {
      console.log("in register process");
      //schema validation
      console.log(req.body);
      const { error, value } = await userSchema.validate(req.body);
      console.log(value);
      if (error) {
        return res.status(401).send({ error: error.details[0].message });
      }
      //check user alreay exists
      const user = await db.users.findOne({ email: value.email });
      if (user) {
        return res.send({ error: "user already exists" });
      }

      //creating salt and encrypt password
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);

      //insert user in database
      const { insertedId } = await db.users.insertOne({
        ...value,
        isVerified: false,
        passReset: "0",
        resetlimit: 0,
      });

      //sending verification mail
      const link = `<p>Hi user, welcome to Dietify</p>
        <p>Kindly click the link below to verify</p><br/>
      <a href="https://hari-dietify.netlify.app/verifyuser/${insertedId}">Click here</a>`;

      await sendMail(value.email, "Verify User", link);

      res.status(200).send({ success: "user registered success" });
    } catch (err) {
      console.log(err.message, err);
      res.status(500).send({ error: "server error" });
    }
  },
  // verify user
  async verifyUser(req, res) {
    //check user to verify
    const user = await db.users.findOne({ _id: ObjectId(req.params.id) });
    if (!user) {
      return res.status(401).send({ error: "you are not authorised" });
    }

    //verified in database
    await db.users.updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { isVerified: true } }
    );
    res.send({ success: "user verify sucess" });
    try {
    } catch (err) {
      res.status(500).send({ error: "server error" });
    }
  },
  //login user
  async loginUser(req, res) {
    try {
    } catch (err) {
      res.status(500).send({ error: "server error" });
    }
  },
  //resettoken send
  async sendPasswordResetLink(req, res) {
    try {
    } catch (err) {
      res.send(500).send({ error: "server error" });
    }
  },
  //veifylink
  async VerifyResetLink(req, res) {
    try {
    } catch (err) {
      res.send(500).send({ error: "server error" });
    }
  },

  // reset passwrod
  async resetPassword(req, res) {
    try {
    } catch (err) {
      res.status(500).send({ error: "server error" });
    }
  },
};

module.exports = service;
