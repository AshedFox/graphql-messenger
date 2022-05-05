import {MiddlewareFn} from "type-graphql";
import {checkAuth, tryRefreshTokens} from "../services/authService";
import {MyContext} from "../types/MyContext";
import {createTokensCookies} from "../services/cookiesService";
import {HttpQueryError} from "apollo-server-core";

export const authMiddleware: MiddlewareFn<MyContext> = async ({context}, next) => {
    const userId = await checkAuth(context.req.cookies);

    if (userId) {
        context.req.userId = userId;
        return next();
    }

    const refreshResult = await tryRefreshTokens(context.req.cookies);

    if (refreshResult) {
        context.req.userId = refreshResult.userId;

        createTokensCookies(context.res, refreshResult.accessToken, refreshResult.refreshToken);
        return next();
    }

    throw new HttpQueryError(401, "Not authorized");
};
