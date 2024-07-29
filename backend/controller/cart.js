const carts = require("../model/cart");

const io = require("../app");

console.log(io, "sjsklm");

async function updateCartLength(userId, length) {
  console.log(userId, length);
  if (io) {
    console.log(userId, length);
    await io.emit("cartLength", length);
  } else {
    console.error("Socket.io instance is not available");
  }
}

exports.insert = async (req, res) => {
  console.log(req.body, req.params.userId);
  const cartExists = await carts.findOne({
    $and: [
      { productId: req.params.productId },
      { userId: req.params.userId },
      { status: "Not Sold" },
    ],
  });
  console.log("sjknskjcns", cartExists);
  if (cartExists) {
    console.log("if");
    console.log(cartExists.name, cartExists._id);
    console.log(parseInt(cartExists.price.replace(",", "")));
    const check = parseInt(cartExists.price) * (cartExists.cartQuantity + 1);
    console.log("jjjjj", check);
    await carts
      .findOneAndUpdate(
        {
          $and: [
            { productId: cartExists.productId },
            { userId: cartExists.userId },
            { status: "Not Sold" },
          ],
        },
        {
          $inc: {
            cartQuantity: 1,
          },
          $set: {
            total: (
              parseInt(cartExists.price.replace(/,/g, "")) *
              (cartExists.cartQuantity + 1)
            ).toLocaleString("en-IN"),
          },
        },
        {
          new: true,
        }
      )
      .then((data) => {
        console.log(data);
        res.status(200).send(data);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  } else {
    console.log("else");
    const cart = new carts({
      name: req.body.name,
      category: req.body.category,
      subcategory: req.body.subcategory,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      productId: req.params.productId,
      userId: req.params.userId,
      cartQuantity: 1,
      total: req.body.price,
      status: "Not Sold",
    });
    cart
      .save()
      .then(async (data) => {
        const response = await carts.find({ userId: data.userId,status:"Not Sold" });
        console.log(response.length);
        await updateCartLength(data.userId, response.length);
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(401).send(e);
      });
  }
};

exports.updateInc = async (req, res) => {
  const cartExists = await carts.findById(req.params.id);
  console.log(cartExists);
  if (cartExists) {
    // console.log((parseInt(cartExists.total.replace(/,/g,"")) * (cartExists.cartQuantity + 1)).toLocaleString('en-IN'),"ssjskmckl");
    carts
      .findByIdAndUpdate(
        req.params.id,
        {
          $inc: { cartQuantity: 1 },
          $set: {
            total: (
              parseInt(cartExists.price.replace(/,/g, "")) *
              (cartExists.cartQuantity + 1)
            ).toLocaleString("en-IN"),
          },
        },
        { new: true }
      )
      .then((data) => {
        console.log(data);
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(401).send(e);
      });
  }
};

exports.updateDec = async (req, res) => {
  const cartExists = await carts.findById(req.params.id);
  if (cartExists && cartExists.cartQuantity >= 2) {
    // console.log((parseInt(cartExists.total.replace(/,/g,"")) * (cartExists.cartQuantity + 1)).toLocaleString('en-IN'),"ssjskmckl");
    carts
      .findByIdAndUpdate(
        req.params.id,
        {
          $inc: { cartQuantity: -1 },
          $set: {
            total: (
              parseInt(cartExists.total.replace(/,/g, "")) -
              parseInt(cartExists.price.replace(/,/g, ""))
            ).toLocaleString("en-IN"),
          },
        },
        { new: true }
      )
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(401).send(e);
      });
  }
};

exports.findById = (req, res) => {
  carts
    .find({ $and: [{ userId: req.params.id }, { status: "Not Sold" }] })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

exports.delete = async (req, res) => {
  await carts
    .findByIdAndDelete(req.params.id)
    .then(async (data) => {
      res.status(200).send(data);
      const response = await carts.find({ userId: data.userId,status:"Not Sold" });
      console.log(response.length);
      await updateCartLength(data.userId, response.length);
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

const products = require("../model/product");

exports.updateStatus = (req, res) => {
  carts
    .findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "Sold",
        },
      },
      { new: true }
    )
    .then(async (data) => {
      const productData = await products.findById(data.productId);
      if (productData) {
        console.log(productData, "jknajan");
        await products.findByIdAndUpdate(
          productData._id,
          {
            quantity: parseInt(productData.quantity) - data.cartQuantity,
          },
          { new: true }
        );
      }
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

exports.list = (req, res) => {
  carts
    .find()
    .populate("userId")
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(401).send(e);
    });
};

exports.search = async (req, res) => {
  if (req.params.name === " ") {
    carts
      .find()
      .populate("userId")
      .then((data) => {
        console.log(data);
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(401).send(e);
      });
  } else {
    const name = new RegExp(req.params.name, "i");
    const cartExists = await carts.findOne({
      $or: [
        { name: { $regex: name } },
        { category: { $regex: name } },
        { subcategory: { $regex: name } },
      ],
    });
    if (cartExists) {
      carts
        .find({
          $or: [
            { name: { $regex: name } },
            { category: { $regex: name } },
            { subcategory: { $regex: name } },
            // { "userId.username": { $regex: name } }
          ],
        })
        .populate("userId")
        .then((data) => {
          console.log(data);
          res.status(200).send(data);
        })
        .catch((e) => {
          res.status(401).send(e);
        });
    } else {
      console.log("search");
      carts
        .find()
        .populate("userId")
        .then((data) => {
          // console.log(data,"search");
          let filteredUsername = data.filter(
            (item) =>
              item.userId.username.match(name) ||
              item.userId.email.match(name) ||
              item.userId.mobile.match(name)
          );
          // console.log(filteredUsername, "user");
          res.status(200).send(filteredUsername);
        })
        .catch((e) => {
          console.log(e);
          res.status(404).send(e);
        });
    }
  }
};
