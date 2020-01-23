
## Prepare - mock soap
- npm start

## Prepare - environment
export COGNITO_REGION=  
export COGNITO_USER_POOL_ID=  


## Prepare - token config for e2e test:
You need three token by aws cognito to test
1. configure a aws cognito
2. sign up three test account (aws-cognito-setup/docs/images/usage_1.png, skip email verify step)  
>>  first:    test@topcoder.com    
  second:   newTest@topcoder.com  
  third:    test123@topcoder.com  
3. 
Confirm this three user (aws-cognito-setup/docs/images/usage_2.png)

4. get token by login endpoint of postman (or by [login.js](aws-cognito-setup/docs/login.js), This is a login server you can use to fast login) 
then replace config/test.js
>>  first     <-->  token_user  
  second    <-->  token_new-user  
  third     <-->  token_old-user  

## Test:
- npm run test
- npm run test:cov
- npm run test:e2e
- npm run test:e2e:cov

notes: 
Some files were ignored when test coverage. i.e.
- dataprovider and .entity.ts will be mocked for e2e and unit test
- .req.dto.ts, .pipe.ts, .guard.ts can't be accessed when unit test
You can check "coveragePathIgnorePatterns" of test/jest-e2e.json and package.json

