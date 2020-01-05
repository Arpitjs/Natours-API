let fs = require('fs')
let mongoose = require('mongoose')
let dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
let Tour = require('../../models/tourModel')

let DB = process.env.DATABASE_LOCAL
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log('database connected.'))

let tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))

let importData = async () => {
    try {
        await Tour.create(tours)
        console.log('data all loaded.')
        process.exit()
    } catch (e) {
        console.log(e)
    }
}

let deleteData = async () => {
    try {
        await Tour.deleteMany()
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
