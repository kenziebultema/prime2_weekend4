var express = require('express');
var path = require('path');
var pg = require('pg');

var router = express.Router();

var connectionString;

if(process.env.DATABASE_URL){
    pg.defaults.ssl = true;
    connectionString = process.env.DATABASE_URL;
} else {
    connectionString = 'postgres://localhost:5432/todo';
}

router.delete('/todo', function(req, res){
    console.log('body', req.body);
    var id = req.body.id;

    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.log('error post', err);
            done();
        } else {
            var result = [];
            var query = client.query('DELETE FROM todo WHERE id = ($1)', [id]);

            query.on('row', function(row){
                result.push(row);
            });

            query.on('end', function(){
                done();
                res.send(result);
            });

            query.on('error', function(error){
                console.log('error query delete', error);
                done();
                res.status(500).send(error);
            });
        }
    });
});

router.put('/todo', function(req, res){
    console.log('body', req.body);
    var id = req.body.id;
    var completed = req.body.completed;
    var task = req.body.task;

    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.log('error post', err);
            done();
        } else {
            var result = [];
            var query = client.query('UPDATE todo SET completed = ($2) WHERE id = ($1) AND task = ($3) RETURNING id, completed, task', [id, completed, task]);

            query.on('row', function(row){
                result.push(row);
            });

            query.on('end', function(){
                done();
                res.send(result);
            });

            query.on('error', function(error){
                console.log('error query post put', error);
                done();
                res.status(500).send(error);
            });
        }
    });
});

router.post('/todo', function(req, res){
    console.log('body', req.body);
    var task = req.body.task;
    var completed = false;

    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.log('error post', err);
            done();
        } else {
            var result = [];
            var query = client.query('INSERT INTO todo (task, completed) VALUES ($1, $2) RETURNING id, task, completed', [task, completed]);

            query.on('row', function(row){
                result.push(row);
            });

            query.on('end', function(){
                done();
                res.send(result);
            });

            query.on('error', function(error){
                console.log('error query post', error);
                done();
                res.status(500).send(error);
            });
        }
    });
});

router.get('/todo', function(req, res){
    pg.connect(connectionString, function(err, client, done){
        if(err){
            console.log('error get', err);
            done();
            res.status(500).send(err);
        } else {
            var result = [];
            var query = client.query('SELECT * FROM todo');

            query.on('row', function(row){
                result.push(row);
            });

            query.on('end', function(){
                done();
                res.send(result);
            });

            query.on('error', function(error){
                console.log('error query get', error);
                done();
                res.status(500).send(error);
            });
        }
    });
});

router.get('/*', function(req, res){
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, '../public/', file));
});

module.exports = router;
