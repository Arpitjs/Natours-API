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

let tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name, man.'],
        unique: true
    },
    rating: {
        type: Number,
        default: 3
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price, man.']
    }
})

let Tour = mongoose.model('Tour', tourSchema)
let testTour = new Tour({
    name: 'David Bowie',
    rating: 100,
    price: 10000
})

testTour.save().then(doc => console.log(doc))
.catch(err => console.log(err))

let port = process.env.PORT
app.listen(port, () => console.log('app running @ ' + port))