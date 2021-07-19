var multer = require('multer');
var path = require('path')
const db = require('../db')

exports.upload_profile_image =  async(req, res, next) => {
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(process.cwd(), '/uploads/profile_pic/'))
        },
        filename: (req, file, cb) => {
            cb(null, req.session.userName+".jpg")
        }
      });
    var upload = multer({ storage: storage })
    return upload.single("Profile Pic")(req, res, next)
}

exports.upload_recipe_image = async(req, res, next) => {
    name = await Number(db.get_n_recipes())+1
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(process.cwd(), '/uploads/recipe/'))
        },
        filename: (req, file, cb) => {
            cb(null,Number(name) +".jpg")
        }
    });
    var upload = multer({ storage: storage })
    return upload.single("Recipe_Image")(req, res, next)
}


