class ApiFeatures {
    constructor(query, queryData){
        this.query = query,
        this.queryData = queryData
    }
    search(){
        const keyword = this.queryData.keyword ? {
            name:{
                $regex:this.queryData.keyword,
                $options:'i'
            }
        }:{}

        this.query = this.query.find({...keyword})
        return this
    };

    filters() {
        const queryDataCopy = { ...this.queryData}
        // Removing some fields for category
        const removeFields = ['keyword', 'page', 'limit']
        removeFields.forEach(key => delete queryDataCopy[key])
        // filter for Price and Rating
        let queryData = JSON.stringify(queryDataCopy)
        queryData = queryData.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        queryData = JSON.parse(queryData)
        this.query = this.query.find(queryData)
        return this
    }

    pagination(per_page) {
        const curentPage = Number(this.queryData.page) || 1;
        const limit = Number(this.queryData.limit) || per_page;
        const skip = limit * (curentPage - 1)

        this.query = this.query.limit(limit).skip(skip)
        return this
    }
}

export default ApiFeatures;