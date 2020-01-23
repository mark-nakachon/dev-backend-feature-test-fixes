const env = process.env
module.exports = {
    PORT: env.PORT,
    COGNITO_REGION: env.COGNITO_REGION,
    COGNITO_USER_POOL_ID: env.COGNITO_USER_POOL_ID,
    TOKEN_USE: env.TOKEN_USE,
    SOAP_URL: env.SOAP_URL,
    DB_DIALECT: env.DB_DIALECT,
    DB_HOST: env.DB_HOST,
    DB_PORT: env.DB_PORT,
    DB_USERNAME: env.DB_USERNAME,
    DB_PASSWORD: env.DB_PASSWORD,
    DB_DATABASE: env.DB_DATABASE,
}

