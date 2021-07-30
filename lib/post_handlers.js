const db = require('../db');

const User = require('./users')
const Recipe = require('./recipes')

exports.upgrade = async (req, res) => {
    chef = new User.Chef(req.session.userName)
    chef.upgrade(req.body.url, req.body.Telephone)
    req.session.pro = true;
    res.redirect(303,'/create')
}

exports.authentication = async (req, res) => {
    req_user_name = req.body.uname.toLowerCase()
    password = req.body.password
    user = new User.User(req_user_name, password)
    if (user.authenticate())
    {
        req.session.userName = req_user_name
        req.session.logged_in =  true
        req.session.pro = await db.is_Pro(req_user_name)
        res.redirect(303,'/')        
    }
    else
    {
        res.redirect(303, '/login')
    }
}

exports.signing_up = async (req, res) => {
    req_user_name = req.body.uname.toLowerCase()
    password = req.body.password
    dob = req.body.dob
    gender = req.body.Gender
    user = new User.User(req_user_name, password)
    user.signup(dob, gender)
    res.redirect(303, '/login')
}

exports.add = async (req, res, next) => {
    const req_Ingredients = req.body.Ingredients.split(";")
    var Ingredients = []
    for (i = 0;i<req_Ingredients.length;i++) {
        Ingredients.push(req_Ingredients[i].split(","))
    }
    const steps = req.body.Actual_Steps.split(";")
    const recipe = new Recipe(req.body.name, req.session.userName)
    
    await recipe.add( req.body.duration, req.body.Dificulty, Ingredients,steps)
    res.redirect(303, '/')
}