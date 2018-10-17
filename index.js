const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./db');
const users = require('./routes/user');
const passport = require('passport');
const apiRoutes = require('./routes/api-routes');
const cors = require('cors');
const path = require('path');

mongoose.connect(config.DB, { useNewUrlParser: true}).then(
  () => console.log('Database is connected'),
  err => console.log('Cannot connect to the database'+ err)
);

const app = express();
app.use(cors());
app.use(passport.initialize());
require('./passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.use('/api/users', users);
app.use('/api', apiRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, function () {
  console.log('Running cluster3d server on port ' + port);
});