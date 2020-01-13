let express = require('express')
let router = express.Router()
let viewsController = require('../controllers/viewController')

router.get('/', viewsController.getOverview)
router.get('/tours/:slug',viewsController.getTour)

module.exports = router