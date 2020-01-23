const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

function register() {
    if(typeof process.env.UserPoolId == 'undefined' || typeof process.env.ClientId == 'undefined'){
        console.log(`Missing one or two required process variables: UserPoolId = ${process.env.UserPoolId} , ClientId = ${process.env.ClientId}`)
        return;
    }
    
    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: process.env.UserPoolId,
        ClientId: process.env.ClientId
    });
    
    userPool.signUp('sampleEmail@gmail.com', 'SamplePassword%123', [new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "email",
        Value: "sampleEmail@gmail.com"
    })], null, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
}

register()
