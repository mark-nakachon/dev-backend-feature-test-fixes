const env = process.env
module.exports = {
    PORT: env.PORT || 3000,
    COGNITO_REGION: env.COGNITO_REGION || 'us-east-1',
    COGNITO_USER_POOL_ID: env.COGNITO_USER_POOL_ID || 'us-east-1_Z4NeiJPie',
    TOKEN_USE: env.TOKEN_USE || 'id',
    SOAP_URL: env.SOAP_URL || 'http://localhost:3100/payment?wsdl',
    DB_DIALECT: env.DB_DIALECT || 'postgres',
    DB_HOST: env.DB_HOST || 'localhost',
    DB_PORT: env.DB_PORT || 5432,
    DB_USERNAME: env.DB_USERNAME || 'postgres',
    DB_PASSWORD: env.DB_PASSWORD || 'password',
    DB_DATABASE: env.DB_DATABASE || 'postgres',
}

