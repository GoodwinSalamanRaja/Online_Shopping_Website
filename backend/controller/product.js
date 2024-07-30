const products = require("../model/product");
const path = require("path");
const multer = require("multer");
let random;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    random = Date.now();
    cb(null, random + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.uploader = upload.single("image");

exports.insert = (req, res) => {
  // console.log(req.body.name, random, path.extname(req.file.originalname))
  const product = new products({
    name: req.body.name,
    category: req.body.category,
    subcategory: req.body.subCategory,
    item: req.body.name,
    price: parseInt(req.body.price).toLocaleString('en-IN'),
    quantity: req.body.quantity,
    description: req.body.description,
    image: random + path.extname(req.file.originalname),
  });
  product
    .save()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      console.log(e);
      // res.status(401).send(e);
    });
};

exports.list = (req, res) => {
  products
    .find().sort({createdAt:"desc"})
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.getById = (req, res) => {
  products
    .findById(req.params.id)
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.update = (req, res) => {
  products
    .findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        subcategory: req.body.subcategory,
        item: req.body.name,
        price: parseInt(req.body.price).toLocaleString('en-IN'),
        quantity: req.body.quantity,
        description: req.body.description,
        ...(req.file && {
          image: random + path.extname(req.file.originalname),
        }),
      },
      { new: true }
    )
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.getBySearch = (req, res) => {
  // console.log(req.params.name);
  if (req.params.name === " ") {
    products
      .find()
      .then((products) => {
        res.status(200).send(products);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  } else {
    const name = new RegExp(req.params.name, "i");
    // console.log(name);
    products
      .find({
        $or: [
          {
            name: { $regex: name },
          },
          {
            category: { $regex: name },
          },
          {
            subcategory: { $regex: name },
          },
          {
            item: { $regex: name },
          },
        ],
      })
      .then((products) => {
        res.status(200).send(products);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  }
};

exports.getByCategory = (req, res) => {
  // console.log(req.params.category);
  products
    .find({ category: req.params.category })
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.getBySubCategory = (req, res) => {
  // console.log(req.params.category, req.params.subCategory);
  products
    .find({
      $and: [
        { category: req.params.category },
        { subcategory: req.params.subCategory },
      ],
    })
    .then((products) => {
      res.status(200).send(products);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

exports.getByItem = (req, res) => {
  // console.log(req.params.category,req.params.name);
  if (req.params.name === " ") {
    products
      .find({category:req.params.category})
      .then((products) => {
        res.status(200).send(products);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  } else {
    const name = new RegExp(req.params.name, "i");
    products
      .find({
        $and: [
          { category: req.params.category },
          {
            $or: [
              { subcategory: { $regex: name } },
              { item: { $regex: name } },
              {name:{$regex:name}}
            ],
          },
        ],
      })
      .then((products) => {
        res.status(200).send(products);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  }
};

exports.getByItemInSubCategory = (req, res) => {
  // console.log(req.params.category,req.params.name);
  if (req.params.name === " ") {
    products
      .find({$and:[
        {category:req.params.category},
        {subcategory:req.params.subCategory}
      ]})
      .then((products) => {
        res.status(200).send(products);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  } else {
    const name = new RegExp(req.params.name, "i");
    products
      .find({
        $and: [
          { category: req.params.category },
          {subcategory:req.params.subCategory},
          {
            $or: [
              { item: { $regex: name } },
              {name:{$regex:name}}
            ],
          },
        ],
      })
      .then((products) => {
        res.status(200).send(products);
      })
      .catch((error) => {
        res.status(404).send(error);
      });
  }
};
