import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql';
import bodyParser from 'body-parser';
import UserService from './services/user';

async function init() {
    const app = express();
    app.use(bodyParser.json())
    const PORT = Number(process.env.PORT) || 8000;

    app.get('/', (req, res) => {
        res.json({ message: `server is up and running` })
    })

    const gqlServer = await createApolloGraphqlServer()

    app.use('/graphql',expressMiddleware(gqlServer,{context: async({req})=>{
        //@ts-ignore
        const token = req.headers['token']
        try {
            const user = UserService.decodeJWTToken(token as string)
            return { user };
        } catch (error) {
            return {}
        }
    }}))

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
}

init();