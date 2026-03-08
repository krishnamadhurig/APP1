const fs=require('fs')

const requestHandler=(req,res)=>{
    const url=req.url
    const method=req.method

    if(url==="/"){
        res.setHeader("Content-Type","text/html")
        res.end(`
            <form action="/message" method="POST">
                <label>Name:</label>
                <input type="text" name="username">
                <button type="submit">Add</button>
            </form>
        `)
    }

    else if(url==="/message" && method==="POST"){
        let body=[]

        req.on("data",(chunk)=>{
            body.push(chunk)
        })

        req.on("end",()=>{
            let buffer=Buffer.concat(body)
            let formData=buffer.toString()

            const formValues=formData.split('=')[1]

            fs.writeFile('formValues.txt', formValues,(err)=>{
                res.statusCode=302
                res.setHeader('Location','/')
                res.end()
            })
        })
    }

    else if(url==="/read"){
        fs.readFile('formValues.txt',(err,data)=>{
            res.end(`<h1>${data.toString()}</h1>`)
        })
    }
}

const anotherFunction=()=>{
    console.log("This is another function")
}

exports.requestHandler=requestHandler
exports.testFunction=anotherFunction