import "reflect-metadata";
import express from 'express';
import http from 'http';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors, {CorsOptions} from 'cors';
import {v2 as cloudinary} from "cloudinary"
import {ApolloServer, AuthenticationError} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {ChatResolver} from "./data/resolvers/ChatResolver";
import {DataSource} from "typeorm";
import {Chat} from "./data/enitities/Chat";
import {User} from "./data/enitities/User";
import {ChatUser} from "./data/enitities/ChatUser";
import {File} from "./data/enitities/File";
import {Message} from "./data/enitities/Message";
import {RefreshToken} from "./data/enitities/RefreshToken";
import path from "path";
import {UserResolver} from "./data/resolvers/UserResolver";
import {MyContext} from "./types/MyContext";
import {MessageResolver} from "./data/resolvers/MessageResolver";
import {ChatUserResolver} from "./data/resolvers/ChatUserResolver";
import {WebSocketServer} from "ws";
import {useServer} from "graphql-ws/lib/use/ws";
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageLocalDefault
} from "apollo-server-core";
import {checkAuth, getUserIdFromRefreshToken} from "./services/authService";
import {graphqlUploadExpress} from "graphql-upload";
import {FileResolver} from "./data/resolvers/FileResolver";
import {ChatInvite} from "./data/enitities/ChatInvite";
import {ChatInviteResolver} from "./data/resolvers/ChatInviteResolver";
import {MessageFileResolver} from "./data/resolvers/MessageFileResolver";
import {MessageFile} from "./data/enitities/MessageFile";

dotenv.config();

const main = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    const appDataSource = new DataSource({
        type: "postgres",
        url: process.env.DATABASE_URL,
        entities: [Chat, User, ChatUser, File, Message, RefreshToken, ChatInvite, MessageFile],
        synchronize: true,
        ssl: process.env.SSL_ENABLED === 'true' ?
            { rejectUnauthorized: false } :
            false,
        migrations: [path.join(__dirname, "./migrations/*")],
    });

    await appDataSource.initialize();

    const app = express();
    const httpServer = http.createServer(app);
    const PORT = process.env.PORT || 3000;

    const corsOptions: CorsOptions = {
        credentials: true,
        origin: true
    }

    app.use(cors(corsOptions))
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(graphqlUploadExpress({maxFileSize: 50000000, maxFiles: 10}));

    const schema = await buildSchema({
        resolvers: [ChatResolver, UserResolver, MessageResolver, ChatUserResolver, FileResolver, ChatInviteResolver, MessageFileResolver],
        dateScalarMode: "timestamp"
    });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql"
    });
    const serverCleanup = useServer({
        schema,
        context: async (ctx) => {
            const cookie = ctx.extra.request.headers.cookie;

            if (cookie) {
                const cookies = cookie.split('; ').reduce((prev, current) => {
                    const [name, ...value] = current.split('=');
                    prev = {...prev, [name]: value.join('=')}
                    return prev;
                }, {});

                let userId = await checkAuth(cookies);

                if (userId) {
                    return {userId};
                }

                userId = await getUserIdFromRefreshToken(cookies);

                if (userId) {
                    return {userId};
                }
            }

            throw new AuthenticationError("Not Authorized!");
        },
    }, wsServer);

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}: MyContext) => ({req, res}),
        formatError: error => {
            if (error.extensions.exception.name !== "HttpQueryError") {
                console.log(error);
                return new Error("Unknown error");
            }
            return error;
        },
        csrfPrevention: true,
        cache: "bounded",
        plugins: [
            process.env.NODE_ENV === "production" ?
                ApolloServerPluginLandingPageGraphQLPlayground() :
                ApolloServerPluginLandingPageLocalDefault()
            ,
            ApolloServerPluginDrainHttpServer({httpServer}),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({app, cors: corsOptions});

    httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

main().catch(err => {
    console.error(err);
})
