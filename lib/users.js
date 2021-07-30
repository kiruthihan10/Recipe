const db = require('../db');

const isImageUrl = require('is-image-url');

class User {
    constructor (user_name, password='') {
        this.user_name = user_name
        this.password = password
    }

    async authenticate () {
        var user_name = this.user_name.toLowerCase()
        if (await db.is_User(user_name)) {
            if(await db.authenticate(user_name, this.password)) { 
                return true
            }
        }
        return false             
    }

    async signup (dob, gender) {
        await db.add_User(this.user_name, this.password, dob, gender)
    }

}

class Chef extends User {
    async upgrade (url, telephone) {
        await db.add_Chef(this.user_name, url, telephone)
    }

    card_render() {
        var img_link = "profile_pic/"+ this.user_name +".jpg"
        
        if (! isImageUrl(img_link)) {
            img_link = "/img/default_chef.jpg";
        }
        return {
            name : this.user_name,
            url : "/chefs/" + this.user_name,
            img_link : img_link,
            alt : "Image of " + this.user_name 
        }
    }

    async get_recipes() {
        const recipes = await db.search_recipe_of_chef(this.user_name)
        var render_recipes = []
        for  (var i = 0; i < recipes.length; i++) {
            render_recipes.push({
                name : recipes[i].name,
                img_link : "/recipe/"+recipes[i].pic_id+".jpg",
                alt :  this.name+" by "+ recipes[i].author,
                link : "/recipes/"+recipes[i].name+"/"+recipes[i].author
            })
        }
        return render_recipes
    }

    async page_render (logged_in, pro) {
        const render_recipes = await this.get_recipes()
        await this.get_data_from_db()
        var img_link = "/profile_pic/"+ this.user_name +".jpg"
        if (! isImageUrl(img_link)) {
            img_link = "/img/default_chef.jpg";
        }
        var url = this.url
        if (this.url == "") {
            url = null
        }
        return {
            name : this.user_name,
            img_link : img_link,
            alt : "Picture of "+ this.user_name,
            logged_out : !logged_in,
            pro : pro,
            url : url,//Check for https
            Telephone_Number : this.phone_number,
            recipes : render_recipes            
        }
    }

    async get_data_from_db() {
        const chef_data = await db.get_chef(this.user_name)
        this.phone_number = chef_data.phone_number
        this.url = chef_data.url
    }
}

module.exports = {
    User : User,
    Chef : Chef
}