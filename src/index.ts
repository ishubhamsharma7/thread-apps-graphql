import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from './graphql';
import bodyParser from 'body-parser';

async function init() {
    const app = express();
    app.use(bodyParser.json())
    const PORT = Number(process.env.PORT) || 8000;

    app.get('/', (req, res) => {
        res.json({ message: `server is up and running` })
    })

    const gqlServer = await createApolloGraphqlServer()
    app.use('/graphql',expressMiddleware(gqlServer))

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
}

init();