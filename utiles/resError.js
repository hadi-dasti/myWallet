

class ApiErrorClass{
    constructor(statusCode,msg) {
        this.statusCode= statusCode;
        this.msg = msg;
    }

    static inValidRequest(msg){
        return new ApiErrorClass(400,msg)
    }

    static internalServerError(msg){
        return new ApiErrorClass(500,msg)
    }
}

module.exports = ApiErrorClass