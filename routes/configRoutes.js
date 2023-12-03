const indexRout = require('./index');
const usersRout = require('./users');
const toysRout = require('./toys');

exports.initRoutes = app => {
    app.use('/', indexRout);
    app.use("/users", usersRout);
    app.use("/toys", toysRout);
}