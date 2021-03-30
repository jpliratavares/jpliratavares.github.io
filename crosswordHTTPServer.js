var http = require('http');
var fs = require('fs');

module.exports.server = http.createServer(function (req, res) {
  fileReq = req.url;
  if(req.headers["user-agent"].substr(0,5)=="Links" || req.headers["user-agent"].substr(0,4)=="Lynx")	fileReq="/links_support";
  if(req.headers.referer)
    if(req.headers.referer.split("/").reverse()[0]=="admin")
      fileReq="/admin"+fileReq;
  if(fileReq=="/")	fileReq="/crossword.html";
  if(fileReq=="/admin")	fileReq="/crossword.html";
  if(fileReq.search("\\\.\\\.") != -1)	fileReq="/sdgbhjhfj";

  if(fileReq=="/serverConfig.js" || fileReq=="/admin/serverConfig.js") fileReq="/../serverConfig.js";

  exists = fs.existsSync('static'+fileReq);
  if(!exists){
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<html><head><title>Oops!</title></head><body>Desculpe, mas esse arquivo n&Atilde;o existe. (Ou voc&ecirc; est&aacute; tentando acessar um arquivo cujo acesso bloqueamos especificamente. Isso &eacute; legal.)</body></html>');
    return;
  }
  data = fs.readFileSync('static'+fileReq,'utf8');
  extension=fileReq.substr(fileReq.lastIndexOf("."));
  res.writeHead(200, {'Content-Type': extension==".html"?'text/html':extension==".css"?'text/css':extension==".js"?'text/javascript':'text/plain'});
  res.write(data);
  res.end();
});
