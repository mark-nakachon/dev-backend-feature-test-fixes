const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

function login() {
    if(typeof process.env.UserPoolId == 'undefined' || typeof process.env.ClientId == 'undefined'){
        console.log(`Missing one or two required process variables: UserPoolId = ${process.env.UserPoolId} , ClientId = ${process.env.ClientId}`)
        return;
    }

    const userPool = new AmazonCognitoIdentity.CognitoUserPool({
        UserPoolId: process.env.UserPoolId,
        ClientId: process.env.ClientId
    });

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: 'sampleEmail@gmail.com',
        Password: 'SamplePassword%123',
    });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: 'sampleEmail@gmail.com',
        Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log(result.getAccessToken().getJwtToken().trim());
        },
        onFailure: function (err) {
            console.log(err);
        },

    });
}

login()
