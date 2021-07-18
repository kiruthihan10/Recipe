const { Pool } = require('pg')
const credentials = require('./config')
var passwordHash = require('password-hash')
const {GridFsStorage} = require('multer-gridfs-storage');



const chef_pics = require('./models/chef_pics');
const multer = require('multer');

const { connectionString } = credentials.postgres
const mongo_Connection_String = credentials.mongo.connectionString
const db_con = new Pool({ connectionString })

const storage = new GridFsStorage({
    url : { mongo_Connection_String },
    file : (req, file) => {
        filename = req.session.userName
    }
})

const upload = multer({ storage })

module.exports = {
    get_Chefs_Count : async () => {
        const { rows } = await db_con.query('SELECT COUNT(*) FROM chef')
        return rows[0].count
    },

    get_Users : async () => {
        const { rows } = await db_con.query('SELECT * FROM users')
        return rows.map(row => {
            const user = _.mapKeys(row, (v, k) => _.camelCase(k))
            return user
        })
    },

    is_User : async (user_name )=> {
        const { rows } = await db_con.query('SELECT COUNT(*) FROM users WHERE user_name = $1',[user_name])
        if (Number(rows[0].count) == 1){
            return true
        }
        else {
            return false
        }
    },

    add_User : async (user_name, password, age, gender) => {
        password = passwordHash.generate(password)
        await db_con.query(
            'INSERT INTO users (user_name, password, AGE, GENDER) '+
                'VALUES ($1, $2, $3, $4) '+
               'ON CONFLICT DO NOTHING'
            ,[user_name, password, age, gender]
        )
    },

    add_Chef : async (user_name, url, phone_number) => {
        await db_con.query(
            `
                INSERT INTO chef (
                    user_name,
                    url,
                    phone_number
                ) VALUES ($1, $2, $3);
            `,[user_name, url, phone_number]
        )
    },

    is_Pro : async (user_name) => {
        const { rows } = await db_con.query('SELECT COUNT(*) FROM chef WHERE user_name = $1',[user_name])
        if (Number(rows[0].count) == 1){
            return true
        }
        else {
            return false
        }
    },

    authenticate : async (user_name, password) => {
        const { rows } = await db_con.query('SELECT password FROM users WHERE user_name = $1',[user_name])
        const hashed_password = rows[0].password
        return passwordHash.verify(password, hashed_password)
    },

    search_chef : async(user_name) => {
        const { rows } = await db_con.query('SELECT user_name FROM chef WHERE user_name LIKE $1',["%"+user_name.toLowerCase()+"%"])
        return rows
    },
    
    report : async (post, author, victim) => {
        await db_con.query(
            `
                INSERT INTO report (
                    user_name,
                    post,
                    author
                ) VALUES ($1, $2, $3);
            `,[victim, post, author]
        )
    },

    add_recipe : async (name, author, duration, dificulty, ingredients, steps, pic_id) => {
        await db_con.query(
            `
            INSERT INTO recipe (
                name,
                author,
                duration,
                dificulty,
                ingredients,
                steps,
                pic_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [name, author, duration, dificulty, ingredients, steps, pic_id]
        )
    },

    get_n_recipes : async () => {
        const { rows } = await db_con.query('SELECT COUNT(*) FROM recipe')
        return rows[0].count
    },

    get_recipe : async(name, author) => {
        const { rows }  = await db_con.query(`SELECT * FROM recipe WHERE name = $1 AND author = $2;`,[name, author])
        return rows[0]
    },

    search_recipe : async(name) => {
        const { rows } = await db_con.query('SELECT * FROM recipe WHERE name LIKE $1;',["%"+name+"%"])
        console.log(rows)
        return rows
    },

    search_recipe_of_chef : async(author) => {
        const { rows } = await db_con.query('SELECT * FROM recipe WHERE author = $1;',[author])
        return rows
    },

    get_chef : async(name) => {
        const { rows } = await db_con.query('SELECT * FROM chef WHERE user_name = $1',[name])
        return rows[0]
    },

    get_last_recipes : async(number) => {
        const { rows } = await db_con.query('SELECT * FROM recipe limit $1',[number])
        return rows
    }
}