var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var index = require('./routes/index.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', index);

var port = process.env.PORT || 5000;

var connectionString;

if(process.env.DATABASE_URL){
    pg.defaults.ssl = true;
    connectionString = process.env.DATABASE_URL;
} else {
    connectionString = 'postgres://localhost:5432/todo';
}

pg.connect(connectionString, function(err, client, done){
    if(err){
        console.log('error connecting', err);
    } else {
        var query = client.query('CREATE TABLE IF NOT EXISTS todo ('
                                + 'id SERIAL PRIMARY KEY,'
                                + 'task text NOT NULL,'
                                + 'completed boolean);');

        query.on('end', function(){
            console.log('success created schema');
            done();
        });

        query.on('error', function(){
            console.log('error create schema');
            done();
        });

    }
});

app.listen(port, function(){
    console.log('listening on port', port);
});

module.exports = app;
