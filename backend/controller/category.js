const categories = require("../model/category");
const subCategories = require("../model/subCategory");

exports.insert = async (req, res) => {
  const cateogry = await categories.findOne({ category: req.params.category });
  if (cateogry) {
    res.status(201).send({ msg: "The category already exists" });
  } else {
    const category = new categories({
      category: req.params.category,
    });
    category
      .save()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(404).send(e);
      });
  }
};

exports.list = (req, res) => {
  categories
    .find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(404).send(e);
    });
};

exports.findById = (req, res) => {
  categories
    .findById(req.params.id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(404).send(e);
    });
};

exports.findByCategory = (req, res) => {
  // console.log(req.params.category);
  categories
    .findOne({ category: req.params.category })
    .populate("subcategory")
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(404).send(e);
    });
};

exports.searchByCategory = (req, res) => {
  if (req.params.name === " ") {
    categories
      .find()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(404).send(e);
      });
  } else {
    categories
      .find({ category: { $regex: new RegExp(req.params.name, "i") } })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(404).send(e);
      });
  }
};

exports.searchByCategoryAndSubCategory = async (req, res) => {
  if (req.params.name === " ") {
    categories
      .find()
      .populate("subcategory")
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(404).send(e);
      });
  } else {
    const categoryExists = await categories.findOne({
      category: { $regex: new RegExp(req.params.name, "i") },
    });
    // console.log("category==========",categoryExists);
    if (categoryExists) {
      // console.log("working");
      categories
        .find({ category: { $regex: new RegExp(req.params.name,"i") } })
        .populate("subcategory")
        .then((data) => {
          // console.log("dsdsdf",data);
          res.status(200).send(data);
        })
        .catch((e) => {
          res.status(404).send(e);
        });
    } else {
      categories
        .find()
        .populate("subcategory")
        .then((data) => {
          // console.log(data);
          let filteredCategories = [];
          data.forEach((category) => {
            const filteredSubcategories = category.subcategory.filter((sub) =>
              sub.name.match(new RegExp(req.params.name, "i"))
            );
            if (filteredSubcategories.length > 0) {
              filteredCategories.push({
                _id: category._id,
                category: category.category,
                subcategory: filteredSubcategories,
              });
            }
          });
          // console.log(filteredCategories);
          res.status(200).send(filteredCategories);
        })
        .catch((e) => {
          res.status(404).send(e);
        });
    }
  }
};

exports.update = (req, res) => {
  categories
    .findByIdAndUpdate(
      req.params.id,
      { category: req.params.category },
      { new: true }
    )
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(404).send(e);
    });
};

exports.setSubCategoryToCategory = async (req, res) => {
  const subCategory = await subCategories.findOne({
    name: req.params.subCategory,
  });
  if (subCategory) {
    res.status(201).send({ msg: "The sub-category already exists" });
  } else {
    const subCategory = new subCategories({
      name: req.params.subCategory,
    });
    subCategory
      .save()
      .then((data) => {
        categories
          .findOneAndUpdate(
            { category: req.params.category },
            {
              $push: {
                subcategory: data._id,
              },
            },
            { new: true }
          )
          .then((datas) => {
            res.status(200).send(datas);
          })
          .catch((e) => {
            res.status(404).send(e);
          });
      })
      .catch((e) => {
        res.status(404).send(e);
      });
  }
};

exports.listWithSubCategory = (req, res) => {
  categories
    .find()
    .populate("subcategory")
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(404).send(e);
    });
};

exports.findByIdWithSubCategory = (req, res) => {
  categories
    .findById(req.params.id)
    .populate("subcategory")
    .then((datas) => {
      const data = datas.subcategory.filter(
        (item) => item.name === req.params.name
      );
      // console.log(data);
      res.status(200).send({ category: datas, subCategory: data });
    })
    .catch((e) => {
      res.status(404).send(e);
    });
};

exports.updateWithSubCategory = async (req, res) => {
  // console.log(
  //   req.params.categoryId,
  //   req.params.subCategoryId,
  //   req.params.subCategory
  // );
  subCategories
    .findByIdAndUpdate(
      req.params.subCategoryId,
      {
        name: req.params.subCategory,
      },
      { new: true }
    )
    .then(async (updatedSubCategory) => {
      // console.log(updatedSubCategory);
      const x = await categories.findByIdAndUpdate(
        req.params.categoryId,
        { $pull: { subcategory: req.params.subCategoryId } },
        { new: true }
      );
      // console.log(x);
      categories
        .findOneAndUpdate(
          { category: req.params.category },
          {
            category: req.params.category,
            $addToSet: { subcategory: updatedSubCategory._id },
          }
        )
        .populate("subcategory")
        .then((data) => {
          // console.log(data);
          res.status(200).send(data);
        })
        .catch((error) => {
          res.status(404).send(error);
        });
    })
    .catch((e) => {
      res.status(404).send(e);
    });
};
