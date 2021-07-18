const db = require('../db');
const { recipes } = require('./api');
const img = require('./img');

exports.upgrade = async (req, res) => {
    await db.add_Chef(req.session.userName, req.body.url, req.body.Telephone)
    res.redirect(303,'/create')
}

exports.authentication = async (req, res) => {
    req_user_name = req.body.uname
    password = req.body.password
    if (await db.is_User(req_user_name)) {
        if(await db.authenticate(req_user_name, password)) { 
            req.session.userName = req_user_name
            req.session.logged_in =  true
            req.session.pro = await db.is_Pro(req_user_name)
            res.redirect(303,'/')
        }
        else {
            res.redirect(303, '/login')
        }
    }
    else {
        res.redirect(303,'/login')
    }
}

exports.signing_up = async (req, res) => {
    req_user_name = req.body.uname.toLowerCase()
    password = req.body.password
    age = req.body.age
    gender = req.body.Gender
    await db.add_User(req_user_name, password, age, gender)
    res.redirect(303, '/login')
}


exports.add = async (req, res, next) => {
    const req_Ingredients = req.body.Ingredients.split(";")
    var Ingredients = []
    for (i = 0;i<req_Ingredients.length;i++) {
        Ingredients.push(req_Ingredients[i].split(","))
    }
    const steps = req.body.Actual_Steps.split(";")
    await db.add_recipe(req.body.name, req.session.userName, req.body.duration, req.body.Dificulty, JSON.stringify(Ingredients), JSON.stringify(steps), await db.get_n_recipes()+1)
    res.redirect(303, '/')
}