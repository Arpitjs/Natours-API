class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    // filtering
    filter() {
        let queryObj = { ...this.queryString }
        let exlcude = ['page', 'sort', 'limit', 'fields']
        exlcude.forEach(field => delete queryObj[field])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    // sorting
    sort() {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    //fields limiting // i.e. projection
    limit() {
        if (this.queryString.fields) {
            let fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    // pagination
    pagination() {
        let page = this.queryString.page * 1 || 1
        let toLimit = this.queryString.limit * 1 || 100
        let toSkip = (page - 1) * toLimit
        this.query = this.query.skip(toSkip).limit(toLimit)
           return this
    }
}

module.exports = APIFeatures