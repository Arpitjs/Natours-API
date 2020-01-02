let mongoose = require('mongoose')
let dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
let app = require('./app')

let DB = process.env.DATABASE_LOCAL
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log('database connected.'))

let port = process.env.PORT
app.listen(port, () => console.log('app running @ ' + port))
