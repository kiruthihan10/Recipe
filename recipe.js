const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const expressSession = require('express-session')
const cookieParser = require('cookie-parser')

const handlers = require('./lib/handlers')
const api_handlers = require('./lib/api')
const post_handlers = require('./lib/post_handlers')
const button_handlers = require('./lib/button_handlers')
const credentials = require('./config')
const img = require('./lib/img')

const app = express()

const cors = require('cors')



app.use('/api', cors())

app.use(cookieParser(credentials.Secret))

app.use(expressSession({
  resave: true,
  saveUninitialized: false,
  secret: credentials.Secret
}))

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    helpers: {
      section: function(name, options) {
        if(!this._sections) this._sections = {}
        this._sections[name] = options.fn(this)
        return null
      },
    },
  }))

app.set('view engine', 'handlebars')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))

app.use(express.static(__dirname + '/uploads'))


// Core Pages

app.get('/', handlers.home)

app.get('/recipes', handlers.recipes)

app.get('/login', handlers.login)

app.get('/signup', handlers.signup)

app.get('/chefs', handlers.chefs)

app.get('/create', handlers.create)

// Inidividual Pages

app.get('/recipes/:name/:author', handlers.recipe)

app.get('/ingredients/:name', handlers.ingredient)

app.get('/stores/:name', handlers.store)

app.get('/chefs/:name', handlers.chef)

app.get('/pro', handlers.pro)


// Post Backend
app.post("/upgrade", 
    img.upload_profile_image,
    post_handlers.upgrade
)

app.post('/authentication', post_handlers.authentication)

app.post('/signing_up', post_handlers.signing_up)

app.post("/add",
  img.upload_recipe_image,
  post_handlers.add)

//Buttons
app.get('/logout', button_handlers.logout)

// API
app.get('/api/recipes', api_handlers.recipes)

app.get('/api/chefs', api_handlers.chefs)

app.use(handlers.notFound)
app.use(handlers.serverError)

if(require.main === module) {
    app.listen(port, () => {
        '; press Ctrl-C to terminate.' )
    })
  } else {
    module.exports = app
}