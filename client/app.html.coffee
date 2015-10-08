### app.html.coffee
Teacup template for DeskNOW.
###
{renderable,normalizeArgs,comment,doctype,html,head,title,link,meta,script,body,section,main,aside,div,span,p,q,nav,header,footer,h1,h2,h3,h4,a,img,form,input,textarea,label,button,select,option,fieldset,ol,ul,li,table,tr,th,td,em,strong,b,i,blockquote,text,raw,tag,iframe,hr,br,coffeescript}=require 'teacup' #???
util=require 'util'
pkg=require '../package.json'
config=require '../config'
#??? {ignore,initially_hidden,grayscreening,screen,action}=require 'const-helpers/common'

module.exports=renderable ->
	doctype 5
	html ->#??? lang:lang,dir:(if lang in ['he','ar'] then 'rtl' else 'ltr'),-> #??? ICU?
		head ->
			title '''DeskNOW'''
			meta 'http-equiv':'content-type',content:'text/html;charset=utf-8'
			#??? script src:'//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js' #??? Fallback...
			#???... libs' stylesheets, webfonts…?
			link href:'/a/app.css',rel:'stylesheet'
			meta name:'viewport',content:'width=device-width,initial-scale=1'
			#???... SEO: description, keywords, title, h1.
			#???... FB preview: OG tags.
			###???
			link href:'/a/favicon.ico',rel:'shortcut icon' #??? ,type:'image/x-icon'
			link href:'/a/apple-touch-icon-precomposed.png',rel:'apple-touch-icon'
			###
			link href:'//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css',rel:'stylesheet' #??? And fallback how?!
			#??? link href:'//fonts.googleapis.com/css?family=Ubuntu',rel:'stylesheet' #???

		body '.desknow',-> #??? On html instead like/with Modernizr?
			#??? ignore ->initially_hidden '#fb-root' #??? If using FB's SDK to connect client side?
			#??? p '.browsehappy'

			# Debugging stuff???
			if process.env.NODE_ENV is 'development'
				comment util.inspect [
					config
					#comment env? #??? app.locals doesn't work in TC?!
					]

			#??? Non-lazy loading…
			script src:'//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js' #??? LAB.js? Require? #??? Get version from config!
			script '''window.jQuery || document.write('<script src="/lib/jquery-2.1.3.min.js"><\\/script>')''' # Fallback to local.
			script src:'//cdn.rawgit.com/visionmedia/page.js/master/page.js' #??? Uglify!
			script '''window.page || document.write('<script src="/lib/page.js"><\\/script>')''' # Fallback to local.
			script src:'/lib/pointy/pointy.min.js' #??? CDN?
			script src:'/lib/pointy/pointy.gestures.min.js'
			#??? script src:'/socket.io/socket.io.js'
			script src:'/a/app.js' #??? Minify, etc.
