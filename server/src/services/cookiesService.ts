import {Response} from "express";
import ms from "ms";

export const createTokensCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie('X-ACCESS-TOKEN', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms(process.env.ACCESS_TOKEN_LIFETIME as string),
    })
    res.cookie('X-REFRESH-TOKEN', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms(process.env.REFRESH_TOKEN_LIFETIME as string)
    })
}

export const removeTokensCookies = (res: Response) => {
    res.clearCookie('X-ACCESS-TOKEN');
    res.clearCookie('X-REFRESH-TOKEN');
}

export const getAccessTokenFromCookies = (cookies: { [p: string]: string }): string | undefined => cookies['X-ACCESS-TOKEN'];

export const getRefreshTokenFromCookies = (cookies: { [p: string]: string }): string | undefined => cookies['X-REFRESH-TOKEN'];
