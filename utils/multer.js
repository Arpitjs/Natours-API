let multer = require('multer')

let multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users')
    },
    filename: (req, file, cb) => {
        let ext = file.mimetype.split('/')[1]
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
})

let multerFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] == 'image') {
        cb(null, true)
    } else {
        cb(new AppError('Not an image!', 400), false)
    }
}

let upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

//the middleware to be put in the route
// when single photo
exports.uploadUserPhoto = upload.single('photo')

// when multiple with different fields

exports.uploadTourImages = upload.fields([
    {name: 'imageCover', maxCount: 1},
    {name: 'images', maxCount: 3}
])
// when multiple with same name
upload.array('images', 5)