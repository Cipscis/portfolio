var express = require('express');
var app = express();

app.use(express.static('.'));

// If the app receives a POST with a URL ending in 'static.json', return the file
app.post(/static\.json$/, function (req, res) {
	var filePath = './' + req.url;
	res.download(filePath);
});

app.listen(8080, function () {});