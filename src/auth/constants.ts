export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

export const expiresTimeRefreshToken = '7d';
export const expiresTimeAccessToken = '30m';
// export const expiresTimeAccessToken = '30s';
export const expiresTimeAccessTokenMiniSeconds = 15 * 60 * 1000; // expires in 15 minutes
// export const expiresTimeAccessTokenMiniSeconds = 10 * 1000;

export const accessTokensInRedis = 'accessTokensInRedis';
