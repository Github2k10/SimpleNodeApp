var express = require("express");
var router = express.Router();

const documentModel = require("../schema/document");
const userModel = require("../schema/users");
const { isLoggedIn } = require("../routes/userController");

router.post("/add", async function (req, res) {
  const { userid, sessionid, title, description } = req.body;

  if (!userid || !sessionid) {
    return res.status(400).json({
      message: "User id and session id are required",
    });
  }

  try {
    if (!(await isLoggedIn(sessionid, userid))) {
      return res.status(400).json({
        message: "Please login first",
      });
    }

    const user = await userModel.findById(userid);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const newDocument = new documentModel({
      userid: userid,
      title: title,
      description: description,
    });

    const savedDoc = await newDocument.save();

    await user.addDocument(savedDoc._id);

    res.status(200).send(savedDoc);
  } catch (err) {
    res.status(400).json({
      message: "Unable to add document",
      error: err.message,
    });
  }
});

router.put("/edit", async function (req, res) {
  const { userid, sessionid, documentid, title, description } = req.body;

  if (!userid || !sessionid || !documentid) {
    return res.status(400).json({
      message: "User id, document id and session id are required",
    });
  }

  try {
    if (!(await isLoggedIn(sessionid, userid))) {
      return res.status(400).json({
        message: "Please login first",
      });
    }

    const document = await documentModel.findById(documentid);
    if (!document) res.status(404).send("Document not found");

    document.title = title;
    document.description = description;
    document.updatedAt = Date.now();
    await document.save();
    res.send(document);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while updating the document",
      message: err,
    });
  }
});

router.delete("/delete", async function (req, res) {
  const { userid, sessionid, documentid } = req.body;

  if (!userid || !sessionid || !documentid) {
    return res.status(400).json({
      message: "User id, document id and session id are required",
    });
  }

  try {
    if (!(await isLoggedIn(sessionid, userid))) {
      return res.status(400).json({
        message: "Please login first",
      });
    }

    const document = await documentModel.findByIdAndDelete(documentid);
    if (!document) res.status(404).send("Document not found");
    res.send(document);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while deleting the document",
      message: err,
    });
  }
});

router.get("/all", async function (req, res) {
  const { userid, sessionid } = req.body;

  if (!userid || !sessionid) {
    return res.status(400).json({
      message: "User id and session id are required",
    });
  }

  try {
    if (!(await isLoggedIn(sessionid, userid))) {
      return res.status(400).json({
        message: "Please login first",
      });
    }

    const documents = await documentModel.find({ userid: userid });
    if (!documents) res.status(404).send("Documents not found");
    res.send(documents);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while fetching documents",
      message: err,
    });
  }
});

router.get("/getById", async function (req, res) {
  const { userid, sessionid, documentid } = req.body;

  if (!userid || !sessionid || !documentid) {
    return res.status(400).json({
      message: "User id, document id and session id are required",
    });
  }

  try {
    if (!(await isLoggedIn(sessionid, userid))) {
      return res.status(400).json({
        message: "Please login first",
      });
    }

    const document = await documentModel.findById(documentid);
    if (!document) res.status(404).send("Document not found");
    res.send(document);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while fetching document",
      message: err,
    });
  }
});

module.exports = router;
