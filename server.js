let mongoose = require('mongoose')
let dotenv = require('dotenv')

// process.on('uncaughtException', err => {
//     console.log('unhandled exception, shutting down.')
//     console.log(err.name, err.message)
//     process.exit(1)
// })

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
    .catch(() => console.log('error in connection'))

let port = process.env.PORT
let server = app.listen(port, () => console.log('app running @ ' + port))

// process.on('unhandledRejection', err => {
//     console.log(err.name, err.message)
//     console.log('unhandled rejection, shutting down.')
//     server.close(() => {
//         process.exit(1)
//     })
// })

