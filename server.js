var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , url=require('url')


app.listen(4445);
console.log("Server running at http://localhost:4445");

function handler (req, res) {
	var path = url.parse(req.url).pathname;
	switch(path){
	//localhost:4445にアクセスしてきた時の処理
	 case '/':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<h1>Welcome!! Try the <a href="/chat.html">Chat Room!</a></h1>');
      res.end();
      break;
	
	//chat.htmlを読み込む
		case '/chat.html':
			fs.readFile(__dirname + '/chat.html',
				function (err, data) {
					if (err) {
						res.writeHead(500);
						return res.end('Error loading chat.html');
					} 
				res.writeHead(200,{ 'Content-Type': 'text/html' });
				res.end(data);
			});	
		break;
		
	//style.cssを読み込む			
		case '/style.css':
			fs.readFile(__dirname + '/style.css',
				function (err, data) {
					if (err) {
						res.writeHead(500);
						return res.end('Error loading style.css');
					} 
				res.writeHead(200,{ 'Content-Type': 'text/css' });
				res.end(data);
			});	
		break;
	
    default: send404(res);
	}
}
//ファイルが存在しなかった時
send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};	


io.sockets.on('connection',function(socket){
		console.log('connect success!');	
		socket.on('message',function(msg){
			socket.emit('message', msg);
            socket.broadcast.emit('message', msg);
        });
        socket.on('disconnect', function() {
	        console.log(socket.id + ' is disconnected.');
	   });
});