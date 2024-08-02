const siteRoute = require('../router/site.route');

function route(app) {
    app.use('/', siteRoute);
}

module.exports = route;
