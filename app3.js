const http=require('http')
const routes=require('./routes')

routes.testFunction()

const server=http.createServer(routes.requestHandler)

server.listen(8000,()=>{
    console.log("server is running")
})