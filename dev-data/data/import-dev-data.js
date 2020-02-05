let fs = require('fs')
let mongoose = require('mongoose')
let dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
let Tour = require('../../models/tourModel')
let User = require('../../models/userModel')
let Review = require('../../models/reviewModel')

let DB = process.env.DATABASE
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log('database connected.'))

let tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))
let users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))
let reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'))

let importData = async () => {
    try {
        await Tour.create(tours)
        await User.create(users,  { validateBeforeSave: false } )
        await Review.create(reviews)
        console.log('data all loaded.')
        process.exit()
    } catch (e) {
        console.log(e)
    }
}

let deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('data all deleted.')
        process.exit()
    } catch (e) {
        console.log(e)
    }
}

if(process.argv[2] === '--import') {
    importData()
} else if(process.argv[2] === '--delete') {
    deleteData()
}
console.log(process.argv)
