
const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const category = require("../models/category");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error : " do not have proudt id"
            });
        }
        req.product = product;
        next();
    });
;}

//create product
exports.createProduct = (req,res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
      if(err){
          return res.status(400).json({
              error: "problems with image "
          });
      }

      // destructure the fields
      const {name, descripation, price, category, stock }  = fields;


     if( !name || !descripation || !price || !category || !stock){
         return res.status(400).json({
             error : "Please include all Fields"
         });

     } 

      // restrictions on field
      let product = new Product(fields)



      //handle file here  managing the photo
      if(file.photo) {
          if(file.photo.size > 3000000){
              return res.status(400).json({
                  error : "file size too big!"
              });
          }
          product.photo.data = fs.readFileSync(file.photo.path)
          product.photo.contentType = file.photo.type
      }

      //save to the Db
      product.save((err, product) => {
          if(err){
              return res.status(400).json({
                  error : " Saving Tshirt in Db failed"
              });
          }
          res.json(product); 
      });
  });
};

//get product
exports.getProduct = ( req, res) =>{
req.product.photo = undefined

    return res.json(req.product);
}

// taking photo from database middleware for performannce optimization
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data);
    }
    next();
}

//update product
exports.updateProduct = (req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problems with image "
            });
        }
  
        // taking the existing product
        let product = req.product;
        product = _.extend(product, fields )
  
  
  
        //handle file here  managing the photo
        if(file.photo) {
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "file size too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
  
        //save to the Db
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "Updation of product failed"
                });
            }
            res.json(product); 
        });
    });
    

};

//delete product
exports.removeProduct = (req, res) => {

    let product = req.product

    product.remove((err, product)=>{
       if(err){
           return res.status(400).json({
               error: "Unable to delete product"
           });
       } 
       res.json({
           msg: `Successfully deleted ${product}`
       });

    });

};

//product listing

exports.getAllProducts = (req, res)=> {
    let limit = req.query.limit ? parseInt(req.query.limit)  : 8 ;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy , 'asc']])
        .limit(limt)
        .exec((err, product)=>{
            if(err){
                return res.status(400).json({
                    error: " NO product Found "
                });
            }
            res.json(req.product)
        });
}

exports.getAllUniqueCategories = (req , res) => {
    Product.distinct("category", {}, (err, category)=> {
        if(err){
            return res.status(400).json({
                error: "NO category Found"
            });
        }
        res.json(category);
    })
}

//method for updating stock and sold
exports.updateStock = (req, res) => {
   //here is an order which contains lots of products we are looping through up here,
   //prod.count comes from front end 
    let myOperations = req.body.order.products.map(prod => {
        return {
            filter: {_id: prod._id },
            update: {$inc: {stock: -prod.count, sold: +prod.count}}
        }

    } )

    Product.bulkWrite(myOperations, {}, (err, products)=> {
        if(err){
            return res.status(400).json({
                error : "BulkOperation failed "
            });
        }
        next();
    });
};