const jwt = require("jsonwebtoken");

const middleware = {
  async authtoken(req, req, next) {
    let authtoken = req.headers.authtoken;
    console.log("token from headers", authtoken);
    if (authtoken) {
      try {
        req.user = jwt.verify(authtoken, process.env.JWTSECRET);
        next();
      } catch (err) {
        res.status(401).send({ error: "unauthorized" });
      }
    } else {
      res.status(401).send({ error: "non token -unauthorized" });
    }
  },
};
