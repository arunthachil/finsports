var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler   = require('errorhandler'),
    morgan         = require('morgan'),
    routes         = require('./backend'),
    api            = require('./backend/api');
    var path = require('path');

var app = module.exports = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/'));
//app.use('/build', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
var env = process.env.NODE_ENV;
if ('development' == env) {
  app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
}

if ('production' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/api/games', api.games);
app.post('/api/games', api.addgames);
app.put('/api/games', api.editgames);
app.delete('/api/games/:gameId', api.deletegames);
// app.all('/api/games/:eventId', api.game);

app.listen(3000);
console.log('Magic happens on port 3000...');