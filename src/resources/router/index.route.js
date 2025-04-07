const siteRoute = require('../router/site.route');
const songsRoute = require('../router/songs.route');
const singerRoute = require('../router/singer.route');
const usersRoute = require('../router/users.route');
const albumsRoute = require('../router/albums.route');
const topicRoute = require('../router/topic.route');
const partnorRoute = require('../router/partnor.route');
const mvRoute = require('../router/mv.route');
const bannerRoute = require('../router/banner.route');
const apiGlobal = require('../router/apiGlobal.route');
const authRoute = require('../router/auth.route');
const MiddlewareController = require('../app/controller/middleware.controller');

function route(app) {
    // Public routes
    app.use('/auth', authRoute);
    app.use('/api', apiGlobal);
    
    // Protected routes - require authentication
    app.use(MiddlewareController.checkAuth);
    app.use('/songs', songsRoute);
    app.use('/banner', bannerRoute);
    app.use('/mv', mvRoute);
    app.use('/partnors', partnorRoute);
    app.use('/topic', topicRoute);
    app.use('/albums', albumsRoute);
    app.use('/users', usersRoute);
    app.use('/singers', singerRoute);
    app.use('/', siteRoute);
}

module.exports = route;
