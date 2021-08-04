const db = require('../db');

class Recipe {
    constructor (name, author) {
        this.name = name.toLowerCase()
        this.author = author.toLowerCase()
    }

    async get_data_from_db() {
        const recipe = await db.get_recipe(this.name, this.author)
        this.pic_id = recipe.pic_id
        this.steps = recipe.steps
        this.ingredients = recipe.ingredients
    }
    

    render_ingredients() {
        var ingredients = []
        for (var i = 0 ; i < this.ingredients.length-1; i++){
            ingredients.push({name : this.ingredients[i][0], Quantity : this.ingredients[i][1], Measurement : "g", url : "/ingredients/"+this.ingredients[i][0]})
        }
        return ingredients
    }

    render_steps() {
        var steps = this.steps.slice(0,this.steps.length-1)
        steps = steps.join("</li><li>")
        steps = "<ol><li>" + steps + "</li></ol>"
        return steps
    }

    async card_render () {
        await this.get_data_from_db()
        return {
            name : this.name,
            img_link : "/recipe/"+this.pic_id+".jpg",
            alt :  this.name+" by "+ this.author,
            link : "/recipes/"+this.name.split(' ').join('%20')+"/"+this.author
        }       
    }

    async page_render(req) {
        await this.get_data_from_db()
        const steps = this.render_steps()
        const ingredients = this.render_ingredients()
        
        return {
            name : this.name,
            img_link : "/recipe/"+this.pic_id+".jpg",
            alt : this.name+" by "+ this.author,
            logged_out : !req.session.logged_in,
            pro : req.session.pro,
            Ingredients : ingredients,
            steps : steps,
            by : this.author            
        }
    }

    async add(duration, Dificulty, Ingredients, steps) {
        await db.add_recipe(this.name, this.author, duration, Dificulty, JSON.stringify(Ingredients), JSON.stringify(steps), await db.get_n_recipes()+1)
    }

    async report(victim) {
        await db.report(this.name, this.author, victim)
        if (db.get_post_report_count(this.name, this.author)) {
            db.remove_post(this.name, this.author)
        }
    }

    async get_recipe_steps_string() {
        const steps = await db.get_steps_of_recipe(this.name, this.author)
        var para = "First, "+steps[0]+". "
        const sequencers = ["Next", "Then", "After that"]
        for (i=1; i< steps.length - 1; i++){
            para += " "+sequencers[Math.floor(Math.random()*sequencers.length)]+" "+steps[i]+"."
        }
        para += " Finally " + steps[steps.length - 1] +"."
        return para
    }

    async get_recipe_ingredients_string() {
        const ingredients = await db.get_ingredients_of_recipe(this.name, this.author)
        var para = "We need "
        for (i = 0; i < ingredients.length; i++) {
            para += ingredients[i][1]+ " " + ingredients[i][0] + ", "
        }
        para = para.substring(0,para.length-2)+"."
        return para
    }

    async to_string() {
        var para = "To make " + this.name + " by " + this.author +", "
        para += await this.get_recipe_ingredients_string()
        para += " "
        para += await this.get_recipe_steps_string()
        return res.json(para)
    }
}

module.exports = Recipe