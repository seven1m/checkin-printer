var http = require('http');
var url = require('url');
var fs = require('fs');
var spawn = require('child_process').spawn;

var server = http.createServer(function (req, res) {
  var q, query = url.parse(req.url, true).query;

  fs.readFile(__dirname + '/label.pdf', {encoding: 'utf8'}, function(err, pdf) {
    pdf = pdf.toString();
    for(q in query) {
      var val = query[q].replace(/([^a-z0-9 \-_'"])/ig, "\\$1")
      pdf = pdf.replace(new RegExp("<" + q + ">", 'g'), val);
    }

    var lpr = spawn('lpr');
    lpr.stdin.end(pdf);

    var out = ''; 
    lpr.stdout.on('data', function(data) { out += data })
    lpr.stderr.on('data', function(data) { out += data })
    
    lpr.on('exit', function(code) {
      if(code == 0) {
        console.log('print success:', query);
        res.writeHead(200);
        res.end();
      } else {
        console.log('print fail:', query);
        console.log(out);
        res.writeHead(500);
        res.end(out)
      }
    });
  });
})

server.listen(8080);

console.log('Server running on port 8080');
