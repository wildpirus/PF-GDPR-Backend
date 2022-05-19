const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { config } = require('./config/config');
const {
  logErrors,
  errorHandler,
  boomErrorHandler
} = require('./middlewares/errorHandler')

const app = express();

app.use(express.json());


/*const whitelist = ['http://localhost:8080', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors(options));*/
app.use(cors());

require('./utils/auth');

app.get('/', (req,res) => {
  res.status(200).json({
    message: 'hello world'
  });
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log("Deployed");
});
