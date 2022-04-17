import {Response} from "express";

export const createTokensCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const accessLifetime = process.env.ACCESS_TOKEN_LIFETIME as string;
    const refreshLifetime = process.env.REFRESH_TOKEN_LIFETIME as string;

    res.cookie('X-ACCESS-TOKEN', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: Number.parseInt(accessLifetime.substring(0, accessLifetime.length - 1)) * 1000 * 60
    })
    res.cookie('X-REFRESH-TOKEN', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: Number.parseInt(refreshLifetime.substring(0, refreshLifetime.length - 1)) * 1000 * 60 * 60 * 24
    })
}

export const removeTokensCookies = (res: Response) => {
    res.clearCookie('X-ACCESS-TOKEN');
    res.clearCookie('X-REFRESH-TOKEN');
}

export const getAccessTokenFromCookies = (cookies: {[p: string]: string}): string|undefined => cookies['X-ACCESS-TOKEN'];

export const getRefreshTokenFromCookies = (cookies: {[p: string]: string}): string|undefined => cookies['X-REFRESH-TOKEN'];


export default {
    createTokensCookies,
    removeTokensCookies,
    getAccessTokenFromCookies,
    getRefreshTokenFromCookies
}
