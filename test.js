var Stream = require('stream')
Stream.prototype.tap = require('./main')

var http = require('http')
var fs = require('fs')

var index = 'index.html'
var tapped = 'index.html.tap'

var fin = new Stream()
fin.destroy = function () {
	var i = fs.readFileSync(index, 'utf8')
	var t = fs.readFileSync(tapped, 'utf8')
	// i and t aren't required to be equal since 'tap' is allowed to drop data,
	// but if they are we know it worked
	console.assert(i === t)
	console.log("it worked!")

	fs.unlinkSync(index)
	fs.unlinkSync(tapped)
}

http.get({
  host: 'google.com',
  port: 80,
  path: '/' + index
},
function (res) {
	res
	.tap(fs.createWriteStream(tapped))
	.pipe(fs.createWriteStream(index))
	.pipe(fin)
})