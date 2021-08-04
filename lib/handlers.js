const db = require('../db');
const fs = require('fs')

const Recipe = require('./recipes')
const Users = require('./users')

exports.home = async (req, res) => {
    logged_out = !req.session.logged_in
    pro = req.session.pro
    function lower(n,base = 10) {
        return Math.floor(n/base) * base
    }
    var num_chefs = await db.get_Chefs_Count()
    var num_recipes = await db.get_n_recipes()//Change As database founded
    num_chefs = lower(num_chefs, 1);
    num_recipes = lower(num_recipes, 1)
    const recipes = await db.get_last_recipes(10)
    render_recipes = []
    for  (i = 0; i < recipes.length; i++) {
        render_recipes.push({
            name : recipes[i].name,
            img_link : "/recipe/"+recipes[i].pic_id+".jpg",
            alt :  recipes[i].name+" by "+ recipes[i].author,
            link : "/recipes/"+recipes[i].name+"/"+recipes[i].author
        })
        
    }
    res.render('home', {chef_count : num_chefs, recipes_count : num_recipes, logged_out : logged_out, pro : pro, recipes : render_recipes
    })
}

exports.recipes = (req, res) => res.render('recipes', {logged_out : !req.session.logged_in, pro : req.session.pro})

exports.login = (req, res) => {
    if (req.session.logged_in){
        res.redirect(303, '/')
    }
    else{
        res.render('login', {logged_out : !req.session.logged_in})}
}

exports.signup = (req, res) => {
    if (req.session.logged_in){
        res.redirect(303, '/')
    }
    else{
        res.render('signup', {logged_out : !req.session.logged_in})
    }
}

exports.chefs = (req, res) => res.render('chefs', {logged_out : !req.session.logged_in, pro : req.session.pro,})

exports.recipe = async (req, res) => {
    const name = req.params.name.split('%20').join(' ')
    const author = req.params.author
    const this_recipe = new Recipe(name, author)
    const render = await this_recipe.page_render(req)
    res.render('recipe', render)
}

exports.ingredient = (req, res) => {
    const name = req.params.name    
    res.render('ingredient', {name : name, img_link : "/img/logo.png", alt : "Image", logged_out : !req.session.logged_in, pro : req.session.pro,
        Nutrients : [//Change As database founded
            { name : "Energy", Quantity : 250, Measurement : "kJ"},
            { name : "Fat", Quantity : 2, Measurement : "g"},
            { name : "Vitamin"}
        ],
        Stores : [//Change As database founded
            { name : "Food City", Price : 200, Measurement : "Rs/kg", url : "/stores/Food%20City"},
            { name : "Sathosa", Price : 150, Measurement : "Rs/kg", url : "/stores/sathosa"},
        ]
    })
}

exports.store = (req, res) => {
    const name = req.params.name    
    res.render('store', {
        name : name,
        img_link : "/img/logo.png",
        alt : "Image",
        logged_out : !req.session.logged_in,
        pro : req.session.pro,
        url : "www.store.com",
        address : "Address Here, Extended to give the Long Feel",
        Telephone_Number : "1234578960"
    })
}

exports.chef = async (req, res) => {
    const num_recipes = 5;
    const name = req.params.name
    const chef = new Users.Chef(name, "")
    const render = await chef.page_render(req.session.logged_in, req.session.pro)
    res.render('chef',render)
}

exports.pro = (req, res) => {
    if (req.session.logged_in == true) {
        if (req.session.pro == false) {
            res.render('pro', {logged_out : !req.session.logged_in, pro : req.session.pro,})
        }
        else {
            res.redirect(303, '/')
        }
    }
    else {
        res.redirect(303, '/login')
    }
}

exports.create = async (req , res) => {
    if (req.session.logged_in == true) {
        if (req.session.pro == true) {
            const data = await fs.readFileSync(
                './public/data/ingredients_only',
                {encoding:'utf8', flag:'r'}).split("\n")
            var ingredients = []
            for (i = 0; i < data.length ; i++ ){
                ingredients.push({ name : data[i] })
            }

            res.render('create', {logged_out : !req.session.logged_in, pro : req.session.pro,
                Ingredients : ingredients
            } )
        }
        else {
            res.redirect(303, '/pro')
        }
    }
    else {
        res.redirect(303, '/login')
    }
}

exports.about = (req, res) => {
    res.render('about',{logged_out : !req.session.logged_in, pro : req.session.pro})
}

exports.serverError = (err, req, res, next) => {
    console.log(err)
    res.render('500')
}

exports.notFound = (req, res) => res.render('404')
