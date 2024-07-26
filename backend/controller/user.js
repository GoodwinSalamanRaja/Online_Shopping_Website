const users = require("../model/user");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");

exports.insert = async (req, res) => {
  const user = await users.findOne({ username: req.body.username });
  if (user) {
    res.status(200).send({ status: false, msg: "The username already exists" });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new users({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      mobile: req.body.mobile,
      otp: "",
    });
    user
      .save()
      .then((data) => {
        res.status(200).send({ status: true, data: data });
      })
      .catch((e) => {
        res.status(401).send(e);
      });
  }
};

exports.check = async (req, res) => {
  const user = await users.findOne({ username: req.body.username });
  console.log(user);
  if (user) {
    bcrypt.compare(req.body.password, user.password, (e, result) => {
      console.log(result);
      if (result === true) {
        const token = jsonWebToken.sign({ userId: user._id }, "login-token", {
          expiresIn: "24h",
        });
        res.status(200).send({
          status: true,
          msg: "Successfully login!",
          data: user,
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

exports.forgotPassword = async (req, res) => {
  console.log(req.params.email);
  const user = await users.findOne({ email: req.params.email });
  console.log(user);
  if (user) {
    const random = Math.random().toString().split(".");
    const otp = random[1].slice(0, 6);
    console.log(otp);
    const nodemailer = require("nodemailer");
    const admin = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: "saravanan@wearedev.team",
        pass: "NpBkV5jlr8-WeAlwin",
      },
    });
    await admin.sendMail({
      from: "saravanan@wearedev.team",
      to: req.params.email,
      subject: "Your otp code",
      text: `Your otp code is ${otp}`,
      html: `<h4>Your otp code is ${otp}</h4>`,
    });
    const otpUpdate = await users.findByIdAndUpdate(
      user._id,
      {
        otp: otp,
        expiryTime:Date.now() + 1 * 60 * 1000
      },
      { new: true }
    );
    res.status(200).send({msg:"The OTP was successfully send to your email!",email:otpUpdate.email});
  } else {
    res.status(201).send({ msg: "The email doesnot exists!" });
  }
};

exports.verify = async (req,res) => {
  console.log(req.params.email,req.params.otp);
  const user = await users.findOne({email:req.params.email})
  if(user.expiryTime > Date.now()){
    if(user.otp === req.params.otp){
      res.status(200).send({msg:"Success"})
    }
    else{
      res.status(201).send({msg:"The OTP you entered is incorrect"})
    }
  }
  else{
    res.status(202).send({msg:"OTP code expired"})
  }
}

exports.updatePassword = async (req,res) => {
  console.log(req.params.email,req.params.password);
  const user = await users.findOne({email:req.params.email})
  if(user){
    const hashedPassword = await bcrypt.hash(req.params.password,10)
    await users.findByIdAndUpdate(user._id,
      {
        password:hashedPassword
      },
      {new:true}
    )
    res.status(200).send({msg:"The password updated successfully click ok to login!"})
  }
  else{
    res.status(201).send({msg:"The email doesnot exists"})
  }
}

exports.getByIdForUser = (req, res) => {
  // console.log(req.params.id);
  users
    .findById(req.params.id)
    .select("-password -_id -__v")
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.getByIdForAdmin = (req, res) => {
  users
    .findById(req.params.id)
    .select("-password -_id -__v")
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.updateByUser = (req, res) => {
  console.log(req.body, req.params.id);
  users
    .findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true }
    )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.updateByAdmin = (req, res) => {
  users
    .findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        // password: req.body.password,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true }
    )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.deleteByUser = (req, res) => {
  users
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).send({ msg: "Account deleted successfully!" });
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.deleteByAdmin = (req, res) => {
  users
    .findByIdAndDelete(req.params.id)
    .then((data) => {
      console.log("del",data);
      res.status(200).send({ msg: "User deleted successfully!",data:data});
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.list = (req, res) => {
  users
    .find()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.searchByName = (req, res) => {
  const name = new RegExp(req.params.name, "i");
  users
    .find({
      $or: [{ username: name }, { email: name }],
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.findByPage = (req, res) => {
  console.log(new Date());
  const page = parseInt(req.params.page);
  console.log(page);
  const skip = (page - 1) * 5;
  console.log(skip);
  users
    .find()
    .skip(skip)
    .limit(5)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.findBySize = (req, res) => {
  users
    .find()
    .skip(0)
    .limit(req.params.size)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};
