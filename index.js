/* Require external APIs and start our application instance */
var express = require('express');
var mysql = require('mysql');
var app = express();

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* Configure MySQL DBMS */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'nmcmahan',
    password: 'pass',
    database: 'quotes'
});
connection.connect();

/* The handler for the DEFAULT route */
app.get('/', function(req, res){
    res.render('home');
});

/* The handler for the /author route */
app.get('/author', function(req, res){
    var stmt = 'select quote, l9_author.authorId, firstName, lastName from l9_quotes, l9_author where l9_author.firstName=\'' 
                + req.query.firstname + '\' and l9_author.lastName=\'' 
                + req.query.lastname + '\' and l9_quotes.authorId=l9_author.authorid;'
    connection.query(stmt, function(error, results){
        if(error) throw error;
        console.log(results);
        res.render('quotesearch', {quotes: results, firstName: results, lastName:results}); 
    });
});

/* The handler for the /author/name/id route */
app.get('/author/:aid', function(req, res){
    var stmt = 'select quote, firstName, lastName ' +
               'from l9_quotes, l9_author ' +
               'where l9_quotes.authorId=l9_author.authorId ' + 
               'and l9_quotes.authorId=' + req.params.aid + ';'
    connection.query(stmt, function(error, results){
        if(error) throw error;
        var name = results[0].firstName + ' ' + results[0].lastName;
        res.render('quotes', {name: name, quotes: results});      
    });
});

app.get('/category', function(req, res){
    let cat = req.query.category;
    var stmt = 'select quote, firstName, lastName from l9_quotes, l9_author where l9_quotes.category=\'' + cat + '\' and l9_author.authorId=l9_quotes.authorId;'
               
    connection.query(stmt, function(error, results){
        if(error) throw error;
        res.render('quotesearch', {quotes: results, firstName: results, lastName:results}); 
    });
});

app.get('/gender', function(req, res){
    let gender = req.query.gender;
    if (gender=="M") {
    var stmt = 'select firstName, lastName, sex, quote from l9_author, l9_quotes where l9_quotes.authorId=1 and l9_author.authorId=1 or l9_quotes.authorId=4 and l9_author.authorId=4 or l9_quotes.authorId=5 and l9_author.authorId=5 or l9_quotes.authorId=7 and l9_author.authorId=7;'
    } else {
        var stmt = 'select quote, firstName, lastName from l9_quotes, l9_author where l9_quotes.authorId=2 and l9_author.authorId=2 or l9_quotes.authorId=3 and l9_author.authorId=3 or l9_quotes.authorId=6 and l9_author.authorId=6;'
    }
               
    connection.query(stmt, function(error, results){
        if(error) throw error;
        res.render('quotesearch', {quotes: results, firstName: results, lastName:results});      
    });
});

app.get('/keyword', function(req, res){
    let keyw = req.query.keyw;
    var stmt = 'select quote, firstName, lastName from l9_quotes, l9_author WHERE quote LIKE "%' + keyw + '%" and l9_author.authorId=l9_quotes.authorId;'
    
               
    connection.query(stmt, function(error, results){
        if(error) throw error;
        console.log(results);
        res.render('quotesearch', {quotes: results, firstName: results, lastName:results});      
    });
});

/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

/* Start the application server */
app.listen(process.env.PORT, function(){
    console.log("Server is up and running");
});