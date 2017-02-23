# MIP starter

Jekyll, Node and Sass starter kit for [Metro Ideas Project](http://metroideas.org).

Install dependencies and launch development server. 

```  
git clone https://github.com/metroideas/starter.git  
cd starter && npm install
gulp
```

Includes:

+ [Gulp](http://gulpjs.com)
+ [HTML5 Boilerplate v5.3.0](https://html5boilerplate.com)
+ [Normalize.css v5.0.0](https://necolas.github.io/normalize.css/)
+ [Bourbon v5.0.0](http://bourbon.io)

## Gulp tasks

+ ```gulp```: default task cleans existing build, compiles assets and builds development site
+ ```gulp build-assets```: Compiles minified *.css and *.js files
+ ```gulp build```: Builds Jekyll _site or cleans and builds with ```--clean``` option (aka default task)
+ ```gulp serve```: Runs local BrowserSync server and watches for file changes
+ ```gulp netlify```: Builds full production site. Use as the build command on Netlify

Local build environment is ```--development``` by default. Change with ```--production``` or ```--debug``` options. 