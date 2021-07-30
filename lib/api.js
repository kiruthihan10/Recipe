const db = require('../db');
const fs = require('fs')

const User = require('./users')
const Recipe = require('./recipes.js')

exports.recipes = async (req, res) => {
    const name = req.query.name
    const data = await db.search_recipe(name)
    var recipes = []
    for (i = 0; i < data.length; i++) {
        const recipe = new Recipe(data[i].name, data[i].author)
        recipes.push(await recipe.card_render())
    }
    res.json({recipes : recipes})
}

exports.chefs = async (req, res) => {
    const name = req.query.name
    const rows = await db.search_chef(name)
    var chefs  = []
    for(var i = 0; i < rows.length; i++) {
        const chef = new User.Chef(rows[i].user_name, '')
        chefs.push(await chef.card_render())
    }
    res.json( {chefs : chefs} )
}

exports.report = async (req, res) => {
    const post = new Recipe(req.query.name, req.query.author)
    await post.report(req.session.username)
    return res.json({result : 1})
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

exports.recipe_string = async (req, res) => {
    const name = req.query.name.toLowerCase()
    const author = req.query.author.toLowerCase()
    const recipe = new Recipe(name, author)
    return await recipe.to_string()
}