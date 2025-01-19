class ClientError extends Error {
    constructor(messege, statusCode = 400){
        super(messege)
        this.statusCode = statusCode
        this.name = "Client_Error"
    }
}   

module.exports = ClientError
