export const cookieSettings = process.env.NODE_ENV === 'development'
    ? {
        httpOnly: true,
        sameSite: 'lax',
    }
    : {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    };