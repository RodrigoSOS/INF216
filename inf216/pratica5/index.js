var htpp = require('http');

htpp.createServer(function(req,res){
    res.end("./index.html");
}).listen(8080);

