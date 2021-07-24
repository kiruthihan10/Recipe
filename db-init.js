const { Client } = require('pg')
const credentials = require('./config')
var passwordHash = require('password-hash')

const { connectionString } = credentials.postgres
const db_con = new Client({ connectionString })

const user_table_create = `
CREATE TABLE IF NOT EXISTS users (
    user_name varchar(200) NOT NULL UNIQUE PRIMARY KEY,
    password text NOT NULL,
    DOB date,
    GENDER boolean
);
`

const chef_table_create = `
        CREATE TABLE IF NOT EXISTS chef (
            user_name varchar(200) NOT NULL
                UNIQUE
                PRIMARY KEY
                REFERENCES users(user_name)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
            url text,
            phone_number varchar(10)                   
    );`

const recipe_table_create = `
        CREATE TABLE IF NOT EXISTS recipe (
            name varchar(100) NOT NULL,
            author varchar(200) NOT NULL
                REFERENCES users(user_name)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            duration integer,
            dificulty integer,
            ingredients jsonb,
            steps jsonb,
            pic_id bigint
        )`

const getUsersCount = async db_con => {
    const { rows } = await db_con.query('SELECT COUNT(*) FROM users')
    return Number(rows[0].count)
}

const seedUsers = async db_con => {
    const sql = `
    INSERT INTO users (
        user_name,
        password,
        DOB,
        GENDER
    ) VALUES ($1, $2, $3, $4);
    `

    await db_con.query(sql, [
        'Monica',
        passwordHash.generate('Chandler'),
        '10/10/1997',
        true
    ])
}

console.log("Connection Initializing")

db_con.connect().then(
    async() => {
        try {
            console.log('creating user table')
            await db_con.query(user_table_create)
            const user_count = await getUsersCount(db_con)
            if (user_count === 0) {
                console.log('Seeding Users')
                await seedUsers(db_con)
            }
            console.log('creating chef table')
            await db_con.query(chef_table_create)
            console.log('Creating Recipe Table')
            await db_con.query(recipe_table_create)
        }
        catch(err) {
            console.log('ERROR: could not initalize database')
            console.log(err)
        }
        finally {
            db_con.end()
        }
    }
)