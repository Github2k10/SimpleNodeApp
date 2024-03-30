var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

const userModel = require("../schema/users");
const sessionModel = require("../schema/session");

function isValidPassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

router.get("/userinfo", async function (req, res) {
  const sessionId = req.body.sessionid;
  const userId = req.body.userid;

  if (!sessionId || !userId)
    res.status(400).json({
      message: "User Id and Session Id both required",
    });

  if (isLoggedIn(sessionId, userId)) {
    userModel.findById(userId).then((userData) => {
      const user = {
        username: userData.username,
        documents: userData.documents,
        createdAt: userData.createdAt,
        upadatedAt: userData.updatedAt,
      };

      res.status(200).json(user);
    });
  } else {
    res.status(404).json({
      message: "Not LogedIn",
    });
  }
});

router.post("/register", function (req, res) {
  if (!isValidPassword(req.body.password)) {
    res.status(400).json({
      error:
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    });
    return;
  }

  var userData = new userModel({
    username: req.body.username,
    password: req.body.password,
  });

  userData
    .save()
    .then((userData) => {
      const newSession = new sessionModel({
        userid: userData._id,
      });

      newSession
        .save()
        .then((sessionData) => {
          res.status(200).json({
            userid: userData._id,
            sessionid: sessionData._id,
            username: userData.username,
          });
        })
        .catch((err) => {
          res.status(400).json({
            message: "Unable to add user",
            error: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(409).json({
        message: "user not added",
        error: err.message,
      });
    });
});

router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username)
    res.status(400).json({
      message: "User Id required",
    });

  if (!password)
    res.status(400).json({
      message: "Password required",
    });

  const userData = await userModel.findOne({ username: username });

  if (!userData)
    res.status(404).json({
      message: "User Not found with the given id",
    });

  if (userData.password !== password)
    res.status(401).json({
      message: "Wrong password",
      error: "Unauthorized",
    });

  const newSession = new sessionModel({
    userid: userData._id,
  });

  newSession
    .save()
    .then((sessionData) => {
      res.status(200).json({
        userid: userData._id,
        sessionid: sessionData._id,
        username: userData.username,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Unable to login",
        error: err.message,
      });
    });
});

router.post("/logout", async function (req, res) {
  const sessionid = req.body.sessionid;
  const userid = req.body.userid;

  console.log(req.body);

  if (!sessionid || !userid)
    res.status(400).json({
      message: "User Id and Session Id both required",
    });

  if (isLoggedIn(sessionid, userid)) {
    await sessionModel.findOneAndDelete({ _id: sessionid });

    res.status(200).json({
      message: "Loged Out",
    });
  } else {
    res.status(400).json({
      message: "User not loged in",
    });
  }
});

async function isLoggedIn(sessionId, userId) {
  try {
    const sessionData = await sessionModel.findById(sessionId);
    const userData = await userModel.findById(userId);

    const user = new mongoose.Types.ObjectId(userId);
    const session = new mongoose.Types.ObjectId(sessionId);

    if (user.equals(userData._id) && session.equals(sessionData._id)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = { router, isLoggedIn };
