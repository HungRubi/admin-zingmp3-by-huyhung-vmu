const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const db = require('./config/db/index');
const route = require('./resources/router/index.route');
const methodOverride = require('method-override');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const port = 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.engine(
    '.hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            add: (a, b) => a + b,
            subtract: (a, b) => a - b,
            eq: (a, b) => a === b,
            gt: (a, b) => a > b,
            lt: (a, b) => a < b,
            and: (a, b) => a && b,
            range: (start, end) => {
                let arr = [];
                for (let i = start; i <= end; i++) arr.push(i);
                return arr;
            }
        },
        
    }),
);

app.use(methodOverride('_method'));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(cors({
    origin: ["http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
app.use(cookieParser());
db.connect();
route(app);

app.listen(port, () => {
    console.log(`App is running at localhost:${port}`);
});
