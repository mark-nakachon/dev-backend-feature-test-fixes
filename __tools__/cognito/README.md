1. Create a user pool according to the guide [https://aws.amazon.com/cognito/getting-started/]
2. Add an app client without generate client secret
3. Set env UserPoolId={Pool Id} and ClientId={App client id}
4. `npm i`
5. `node register.js`
6. In `aws cognito/users users and groups` comfirem the register user
7. Get token through `node login.js`
