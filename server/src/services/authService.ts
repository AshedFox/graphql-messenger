import jwt, {JwtPayload} from "jsonwebtoken";
import {getAccessTokenFromCookies, getRefreshTokenFromCookies} from "./cookiesService";
import {RefreshToken} from "../data/enitities/RefreshToken";

export const checkAuth = (cookies: {[p: string]: string}): string|undefined => {
    try {
        const accessToken = getAccessTokenFromCookies(cookies);

        if (accessToken) {
            const payload = jwt.verify(accessToken, process.env.SECRET as string, {
                audience: process.env.AUDIENCE,
                issuer: process.env.ISSUER
            }) as JwtPayload;

            return payload.sub;
        }
        return undefined;
    } catch {
        return undefined;
    }
}

export const generateAccessToken = (userId: string) => {
    return jwt.sign({sub: userId}, process.env.SECRET as string, {
        audience: process.env.AUDIENCE,
        issuer: process.env.ISSUER,
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME
    });
}

export const getUserIdFromRefreshToken = async (cookies: {[p: string]: string}): Promise<string|undefined> => {
    const refreshTokenId = getRefreshTokenFromCookies(cookies);

    if (refreshTokenId) {
        const refreshToken =  await RefreshToken.findOneBy({id: refreshTokenId});

        if (refreshToken) {
            return refreshToken.userId;
        }
    }

    return undefined;
}

export const tryRefreshTokens = async (cookies: {[p: string]: string}): Promise<{ userId: string, refreshToken: string, accessToken: string } | undefined> => {
    try {
        const refreshTokenId = getRefreshTokenFromCookies(cookies);

        if (refreshTokenId) {
            const refreshToken = await RefreshToken.findOneBy({id: refreshTokenId});

            if (refreshToken) {
                const newRefreshToken = await RefreshToken.create({
                    userId: refreshToken.userId
                }).save();

                await refreshToken.remove();

                return {userId: newRefreshToken.userId, refreshToken: newRefreshToken.id, accessToken: generateAccessToken(newRefreshToken.userId)};
            }
        }

        return undefined;
    } catch (e) {
        return undefined;
    }
}


export default {
    checkAuth,
    generateAccessToken,
    tryRefreshTokens
}
