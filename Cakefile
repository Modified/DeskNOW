### Cakefile ###

require 'coffee-script/register' # (So can require CoffeeScript directly, eg config.coffee.)
config=require './config'
pkg=require './package.json' #??? NB: might need reloading if modified, or remember bumped v, and cp for dist after modified. Re-save as "JSON.stringify pkg", which has no whitespace, or util.inspect? #??? Convert source to CSON!

# Dependencies.
fs=require 'fs'
{exec,spawn}=require 'child_process'
require 'colors'

# Options (shared by tasks).
#??? Bump version before build?
#???...

#??? I'll surely forget to set DEBUG?
#if process.env.NODE_ENV is 'development' then process.env.DEBUG or='server,socket.io,body-parser,-engine.io-client'

# Tasks.
task 'start','Continuously compile/preprocess and run local web server',->build ->launch 'coffee',['build/server.coffee'] #??? ,->shell 'chromium-browser localhost:3008' doesn't work, because --watch never returns? #??? --watch broken, hides web server logs, and seems doesn't even rebuild? #???! Add watch!!!
task 'build','Compile/preprocess CS/Stylus, etc',->build ->grin
task 'deploy','Re-build and deploy to production',->process.env.NODE_ENV='production';build ->deploy ->restart ->grin #??? Need option of deploying a development build!? #??? Deploy means not watching, so maybe different build task?
task 'bump','Bump build version',->bump

# Run in a shell.
shell=(cmd,next)-> #??? Use promises instead, so caller decides how to continue?
	console.log 'sh'.cyan,cmd,'...'
	exec cmd,(err,stdout,stderr)->
		if err then console.log 'Error'.red.inverse,err #??? {err,stdout,stderr} #??? err seems always contains entire stderr, so don't dup!? Maybe unless stdout empty, or stderr appears in err?
		else
			if stdout then console.log stdout
			next?()

# Run process, forked, not in shell.
launch=(cmd,options=[],next)->
	console.log 'spawn'.cyan,cmd,options,'...'
	app=spawn cmd,options
	app.stdout.pipe process.stdout
	app.stderr.pipe process.stderr
	app.on 'exit',(status)->
		if status is 0 then next?() #??? Must exist?
		else console.log 'Error:'.red.inverse+" exit code #{status} from #{cmd}"

## Green status.
grin=(next)->console.log ':-)'.green.inverse; next?()

## Clean ./build/ before building to rule out stale assets.
clean=(next)->shell 'rm --recursive --force build/* build/.[!.]* build/..?*',next

## Distribution preparation.
dist=(next)->shell "cp -r --parents config.coffee server.coffee package.json client/images client/lib build",next
#??? && ln --symbolic --verbose ../client/images ../client/lib build",next

## Build client side assets — CoffeeScript, Stylus, Teacup — and prepare distribution.
build=(next)->
	console.log 'Building for',process.env.NODE_ENV?.blue
	clean ->bump ->build_coffee_client ->build_styl ->build_teacup ->dist next

# Compile CoffeeScript into JavaScript.
build_coffee_client=(next)->shell "coffee --compile --output ./build/client client/app.coffee",next

# Preprocess Stylus into CSS.
build_styl=(next)->shell "stylus --use autoprefixer-stylus --compress --out ./build/client client/app.styl",next

# Generate HTML from Teacup templates.
#??? Repeat per translated language. Except office.
#??? Drop the "cd", strip path or use `basename` instead or sth.
build_teacup=(next)->
	shell '''coffee -e "console.log (require './client/app.html.coffee')()" > build/client/app.html''',next #??? Compilation errors don't get caught by this!

#??? Bump build number (for versioning).
bump=(next)->next?() #??? bump=(next)->shell 'B=$((`cat BUILD`+1)); echo -n $B > BUILD; cat BUILD',next #???!!! Edit package.json instead!

# Serve.
serve=(next)->
	console.log 'Serving with DEBUG=',process.env.DEBUG?.blue
	#???! Add watch!!!
	launch 'coffee',['build/server.coffee'],next

# Deploy.
#??? Tag repo automatically with timestamp every time deployed, because no history on WF!!!
deploy=(next)->shell "rsync --copy-links --recursive --compress --verbose --checksum build/ #{config.rsync_dest}",next
restart=(next)->shell 'ssh decode@desknow.decodecode.net "cd ~/webapps/desknow; stop; start; sleep 5; tail ~/logs/user/desknow.log"',next
