const admins = require("../model/admin");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");

exports.insert = (req, res) => {
  const admin = new admins({
    username: req.body.username,
    password: req.body.password,
  });
  admin
    .save()
    .then((data) => {
      res.status(200).send({ status: true, data: data });
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

exports.check = async (req, res) => {
  const admin = await admins.findOne({ username: req.body.username });
  if (admin) {
    bcrypt.compare(req.body.password, admin.password, (e, result) => {
      console.log(result);
      if (result === true) {
        const token = jsonWebToken.sign(
          { adminId: admin._id },
          "admin-login-token",
          {
            expiresIn: "24h",
          }
        );
        res.status(200).send({
          status: true,
          msg: "Successfully login!",
          data: admin,
          token: token,
        });
      } else {
        res.status(200).send({
          status: false,
          msg: "The password you entered is incorrect",
        });
      }
    });
  } else {
    res.status(201).send({ msg: "The username doesnot exists" });
  }
};

exports.get = (req, res) => {
  admins
    .findById(req.params.id)
    .then((data) => {
      res.status(200).send(data.username);
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

exports.update = async (req, res) => {
  try {
    console.log(req.body.password);
    let hashedPassword;
    if(req.body.password){
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
    console.log(hashedPassword);
    admins
      .findByIdAndUpdate(
        req.params.id,
        {
          username: req.body.username,
          password: hashedPassword,
        },
        { new: true }
      )
      .then((data) => {
        res
          .status(200)
          .send({ msg: "Updated successfully", data: data.username });
      })
      .catch((e) => {
        res.status(401).send(e);
      });
  } catch (error) {
    console.log(error);
  }
};
