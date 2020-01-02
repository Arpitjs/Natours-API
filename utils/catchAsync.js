module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next)
            .catch(err => next(err))
    }
}

// function a(b) {
//     return function(c,d,e) {
//         b(c,d,e)
//     }
// }

// function b (x,y,z) {

// }

// uta call handa...
// a(b)
// a call handa b argument pathaeko.
// kinda complicated but not too much.