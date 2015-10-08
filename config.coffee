### config.coffee ###

flag=(env,default_)->
	switch
		when env in ['on','true','yes'] then true
		when env in ['false','no','off'] then false
		else default_

module.exports= # Alphabetically. #??? Or global?
	http_port: process.env.PORT ? 3009  #??? Fallback port is only for local development, right?
	log_format: 'dev' #???
	rsync_dest: 'decode@desknow.decodecode.net:/home/decode/webapps/desknow/'
