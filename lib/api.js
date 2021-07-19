const db = require('../db');
const fs = require('fs')

exports.recipes = async (req, res) => {
    const name = req.query.name
    const data = await db.search_recipe(name)
    var recipes = []
    for (i = 0; i < data.length; i++) {
        recipe = data[i]
        recipes.push({
            name : recipe.name,
            img_link : "/recipe/"+recipe.pic_id+".jpg",
            alt :  name+" by "+ recipe.author,
            link : "/recipes/"+recipe.name+"/"+recipe.author
        })
    }
    //res.json({recipes : [
    //    {name : "Apple Pie", img_link : "/img/logo.png", alt : "Image", link : "/recipes/Apple Pie/Monica"},
    //    {name : "Christmas Apple Pie", img_link : "/img/logo.png", alt : "Image",  link : "/recipes/Christman Apple Pie/Monica"},
    //]})
    res.json({recipes : recipes})
}


exports.chefs = async (req, res) => {
    const name = req.query.name
    const rows = await db.search_chef(name)
    var  chefs  = []
    for(var i = 0; i < rows.length; i++) {
        user_name = rows[i].user_name
        chefs.push({
            name : user_name,
            url : "/chefs/" + user_name,
            img_link : "/profile_pic/"+ user_name +".jpg",
            alt : "Image of " + user_name
        })
    }
    res.json( {chefs : chefs} )
}

exports.report = (req, res) => {
    const name = req.query.name
    const author = req.query.author
    db.report(name, author, req.session.userName)
}

exports.ingredients = async (req, res) => {
    const name = req.query.name.toLowerCase()
    const data = await fs.readFileSync(
        './public/data/ingredients_only',
        {encoding:'utf8', flag:'r'}).split("\n")
    var ingredients = []
    for (i = 0; i< data.length; i++ ) {
        const ingredient = data[i]
        if ( ingredient.toLowerCase().includes(name) ) {
            ingredients.push(ingredient)
        }
    }
    return res.json({ ingredients : ingredients })
}