# streamtap

Tap into a stream. Read-only and drop data instead of applying backpressure

Useful for "monitoring" a stream

## Example

```js
var fs = require('fs')
var http = require('http')
var Stream = require('stream')
Stream.prototype.tap = require('streamtap')

http.get({
	host: 'google.com',
	port: 80,
	path: '/index.html'
},
function (res) {
	res
	.tap(process.stdout)
	.pipe(fs.createWriteStream('index.html'))
})
```

## Testing

    $ npm test


## License

MIT