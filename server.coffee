### server.coffee
DeskNOW: a Battlehack 2015 Tel Aviv project.
###

# Dependencies.
require 'coffee-script/register' # So can require CoffeeScript directly.
express=require 'express'
debug=(require 'debug')('server') #??? Single namespace?

# Initialize, configure.
config=require './config'
version="#{(require './package').version}/#{process.env.TAG or 'untagged'}"
app=express()
#app.http().io() # Start HTTP and WebSockets servers.

# LDB.
#??? mget=require 'level-mget'
sub=require 'level-sublevel'
#!!! db=(require 'level-promise') sub (require 'level') 'data',keyEncoding:'utf8',valueEncoding:'json' #??? Ugly?
#events=db.sublevel 'events'

# Configuration for all environments???
ASSETS=__dirname+'/client' #???

# Middleware.
app
.use (require 'compression')()
# Serve static assets.
.use '/a/',express.static ASSETS # Serve static assets development only??? Deal with cache invalidations for local development, and generally!
.use '/i/',express.static ASSETS+'/images',maxage:3e10
.use '/lib/',express.static ASSETS+'/lib' #??? On error, respond 404 and log it! Or does E default?
#???.use '/styl/',express.static ASSETS+'/styl'
.use (require 'morgan') config.log_format #??? How come static requests logged? Doesn't order of middleware matter?
.use (require 'cookie-parser')()
#??? .use express.favicon()
#???app.use express.json()
#???app.use express.urlencoded()

# Standard UUID format.
uuid=(a)->if a then (a^Math.random()*16>>a/4).toString 16 else ([1e7]+-1e3+-4e3+-8e3+-1e11).replace /[108]/g,uuid

# Routes.
app
# Root???
## Public SPA template.
.all '/',(req,res)->res.sendFile ASSETS+"/app.html" #??? what about caching headers?! Redirect instead to assets MW?
# Directories: redirect to append slash.
#??? .all /\/(..)\/(event|help)$/,(req,res)->res.redirect req.path+'/'

# Start server.
app.listen config.http_port,->
	console.log "Listening on port #{config.http_port}."
