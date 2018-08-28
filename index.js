let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let apiRoutes = require('./routes/api-routes');

let app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/resthub');

const port = process.env.PORT || 5000;

app.use('/api', apiRoutes);
app.listen(port, function () {
  console.log('Running cluster3d server on port ' + port);
});