const indexRout = require('./index');
const usersRout = require('./users');

exports.initRoutes = app => {
    app.use('/', indexRout);
    app.use("/users", usersRout);
}