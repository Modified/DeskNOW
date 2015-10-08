### server.coffee
MatchWiz
- 2015-09-16: revamped; upgraded Constitution.
- 2014-03-17: renamed directories (scaffolding).
- 2014-02-25: dropped Zappa, use Express.IO.
- 2014-02-05: created.
###

# Dependencies.
require 'coffee-script/register'
express=require 'express.oi'

# Initialize, configure.
config=require './config'
version="#{(require './package').version}/#{process.env.TAG or 'untagged'}"
app=express()
app.http().io() # Start HTTP and WebSockets servers.

# LDB.
mget=require 'level-mget'
sub=require 'level-sublevel'
lock=require 'level-lock'
db=(require 'level-promise') sub (require 'level') 'data',keyEncoding:'utf8',valueEncoding:'json' #??? Ugly?
events=db.sublevel 'events'

# Configuration for all environments???
ASSETS=__dirname #???

# Middleware.
app
.use (require 'compression')()
# Serve static assets.
.use '/a/',express.static ASSETS+'/assets' # Serve static assets development only???!!! Deal with cache invalidations for local development, and generally!
.use '/i/',express.static ASSETS+'/images',maxage:3e10
.use '/lib/',express.static ASSETS+'/lib' #??? On error, respond 404 and log it! Or does E default?
#???.use '/styl/',express.static ASSETS+'/styl'
.use (require 'morgan') config.log_format #??? How come static requests logged? Doesn't order of middleware matter?
.use (require 'cookie-parser')()
#??? .use express.favicon()
#???app.use express.json()
#???app.use express.urlencoded()

###???
app.io
#??? .set 'log level',2 # Shut up!
.enable 'browser client minification' # Send minified asset.
.enable 'browser client etag' # Apply etag caching logic based on version number.
.enable 'browser client gzip' # gzip the asset.
###

# Standard UUID format.
uuid=(a)->if a then (a^Math.random()*16>>a/4).toString 16 else ([1e7]+-1e3+-4e3+-8e3+-1e11).replace /[108]/g,uuid

# Routes.
app
# Root.
.all '/',(req,res)->res.redirect '/en/' #??? Should detect language prefs.
# Directories: redirect to append slash.
#??? http://localhost:3009/en/12/34/ — Error: ENOENT, stat '/home/head/Desktop/Work/MatchWiz/Code/build/mw.34.html'
.all /\/(..)\/(event|help)$/,(req,res)->res.redirect req.path+'/'
## Public SPA template.
.all /\/(..)\/(|event\/(.*)|help\/(.*)|login|logout|terms)$/,(req,res)->res.sendFile ASSETS+"/mw.#{req.params[0]}.html" #??? sendfile? but what about caching headers?! Ah, redirect instead to assets!!!

# Messages.
###???
app.io.route 'list_events',(req)->
	req.io.respond [
		{id:'123',title:'Hackathon'}
		{id:'987',title:'An eventful event!'}
		{id:'567',title:'Yet another'}
		]
app.io.route 'create_event',(req)->
	#???... Save event.
	console.log 'create_event',req.data
	db.put req.data,{},(err)->
		if err then throw err #???
		req.io.respond ! err
###

# Start server.
app.listen config.http_port,->
	console.log "Listening on port #{config.http_port}."