# LPC payment backend API

## Configuration

`config/default.js` is default configuration.
`config/test.js` is configuration for test.
`config/production.js` is configuration for production.

- `PORT`: Port of Provider Exchange Audience API.
- `COGNITO_REGION`: Cognito region.
- `COGNITO_USER_POOL_ID`: Cognito user pool id.
- `TOKEN_USE`: Token type.
- `SOAP_URL`: Soap API.
- `DB_DIALECT`: DB dialect for sequelize.
- `DB_HOST`: DB host.
- `DB_PORT`: DB port.
- `DB_USERNAME`: DB user name.
- `DB_PASSWORD`: DB password.
- `DB_DATABASE`: Database name.

## Local Installation

```bash
# install dependencies
$ npm install

# lint
$ npm run lint

# lint fix
$ npm run lint:fix

# format
$ npm run format

# build
$ npm run build
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Docker deployment
It will use a SOAP server deployed in heroku, an AWS RDS instance. You can find the connect information in `docker-compose.yml`. You need to first clear and re-insert test data before perform postman verification.

```bash
$ docker-compose up
```

## Database Setup
Check the sql scripts under db folder.

## AWS EKS setup
Refer https://medium.com/faun/create-your-first-application-on-aws-eks-kubernetes-cluster-874ee9681293

## AWS RDS setup
1. Go to `https://console.aws.amazon.com/rds/home`. Choose **Databases** on the left navigation menu.
2. Choose **Create database**
3. Now you can create database, you need to first create a VPC, refer step 1/2 in previous part.
4. In order to let your database public accessible, after successfully create the database, go to database detail page. Under **Connectivity & security**, you can find **Security** and **VPC security groups**. Choose the security group and will redirect to security group management console. In the bottom choose **Inbound**, click **Edit** to add rule allow PostgreSQL access. The **type** is `PostgreSQL`, the **source** should be `AnyWhere`.

## Verification

Please note that verification for this API needs mocked-soap-api and postgres.
You need to start the mocked-soap-api and postgres before running test.

### Verification guide

1. Start the app.
2. Import postman tests and environment file under `docs` folder.
3. Run the test for up to down.
4. I have create a AWS Gateway API to generate cognito token which is used during authentication. So just remember to execute all three cases under `login` folder before run other tests.
