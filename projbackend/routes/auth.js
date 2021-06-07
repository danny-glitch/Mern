var express = require('express')
var router = express.Router()
const { body, validationResult } = require('express-validator');
const { isLength } = require('lodash');
const {signout, signup, signin, isSignedIn} = require("../controllers/auth")

//SIGN UP ROUTE
router.post("/signup",

//express validator https://express-validator.github.io/docs/index.html

body("name"," name must be at least 3 chars long").isLength({ min:3 }),
body("email","email is required").isEmail(),
body("password","should be atleast 4 char").isLength({ min:4 }),

signup);

//SIGNIN ROUTE
router.post("/signin",

//express validator https://express-validator.github.io/docs/index.html

body("email","email is required").isEmail(),
body("password","password is required").isLength({ min:1 }),

signin);

router.get("/signout", signout);



module.exports = router;