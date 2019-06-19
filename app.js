var http = require("http");
var url = require("url");
var fs = require("fs");
var io = require("socket.io");
const port = 3000;
var server = http.createServer(function(request, response){
    console.log('Connection');
    var path = url.parse(request.url).pathname;
    var routeFunction = function(error, data) {
        if (error){
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
        } else {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(data, "utf8");
        }
        response.end();
    };
    switch (path) {
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('Hello, World.');
            response.end();
            break;
        case '/game_server.html':
            fs.readFile(__dirname + path, routeFunction);
            break;
        case '/player1.html':
            fs.readFile(__dirname + path, routeFunction);
            break;
        case '/player2.html':
            fs.readFile(__dirname + path, routeFunction);
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});
console.log("Run Server On port:", port);
server.listen(port);
var serv_io = io.listen(server);
serv_io.sockets.on('connection', function(socket) {
    socket.on('player', function(data) {
        if (data.hasOwnProperty("player1")) {
            socket.broadcast.emit("player1", data);
        } else if (data.hasOwnProperty("player2")) {
            socket.broadcast.emit("player2", data);
        }
    });
    socket.on('hidden', function (data) {
        if (data.hasOwnProperty("player1")) {
            socket.broadcast.emit("player1_hidden", data);
        }else if (data.hasOwnProperty("player2")) {
            socket.broadcast.emit("player2_hidden", data);
        }
    });
});
