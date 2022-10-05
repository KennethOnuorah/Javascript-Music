const {MongoClient} = require("mongodb") // A mongo client to connect to the mongoDB database

async function main(){
    const uri = ""
    const client = new MongoClient(uri) // Create instance of MongoClient
    try{
        await client.connect()
    }catch (e){
        console.error(e)
    }finally{
        await client.close()
    }
} 
main().catch(console.error)

