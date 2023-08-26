import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
async function init() {
    const app = express();
    app.use(bodyParser.json())
    const PORT = Number(process.env.PORT) || 8000;

    //Create Graphql Server
    const gqlServer = new ApolloServer({
        typeDefs: `
        type Query {
            hello:String
            say(name:String): String
        }
    ` ,//schema
        resolvers: {
            Query:{
                hello : ()=> `Hey there i'm a graphql server`,
                say :(_,{name}:{name:string})=> `hey ${name}, how are you?`
            }
        }
    })

    //Start GQL server
    await gqlServer.start()

    app.get('/', (req, res) => {
        res.json({ message: `server is up and running` })
    })
    app.use('/graphql',expressMiddleware(gqlServer))

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
}

init();