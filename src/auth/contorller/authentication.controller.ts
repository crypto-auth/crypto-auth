import { Controller, UseGuards, Post, Request, Get, Body, Query } from '@nestjs/common';	
import { AuthenticationService } from '../service/authentication.service';	

@Controller('api/oauth2')	
export class AuthenticationController {	

  constructor(private authService: AuthenticationService) {}	

  //client
  @Get('auth')	
  async authenticateClient (
    @Query('client_id') clientId: string, 
    @Query('response_type') responseType: string, 
    @Query('scope') scope: string, 
    @Query('redirect_uri') redirectUri: string, 
    @Query('state') state: string,
    @Query('nonce') nonce: string
  ): Promise<object> {	
    return this.authService.authenticateClient({
      clientId, responseType, scope, redirectUri, state, nonce
    });

    //here should redirect to a special login to metamask page
    // https://auth0.com/docs/get-started/authentication-and-authorization-flow/add-login-auth-code-flow
  }	

  //signin user - consent
  @Get('signin')
  async signinUser (
    @Query('client_id') clientId: string,
    @Query('user_address') userAddress: string,
    @Query('session_id') sessionId: string,
  ): Promise<object> {
    return this.authService.signInUser({ 
      clientId,
      userAddress,
      sessionId
    })
  }


  @Post('token')
  async exchangeAuthorizationTokenForAccessToken (
    @Query('code') code: string,
    @Query('client_id') clientId: string, 
    @Query('client_secret') clientSecret: string, 
    @Query('redirect_uri') redirectUri: string, 
    @Query('grant_type') grantType: string
  ): Promise<object> {
    return this.authService.exchangeAuthorizationTokenForAccessToken({
      code,
      clientId,
      clientSecret,
      redirectUri,
      grantType
    })
  }

  //minting:
  //1. The client - we need to be able to mint it using metamsk from UI
  //2. The user is more complicated:
  //  2.a. The user mints his nft using Metamask. 
  //  2.b. The data which is generated is JWT - we encrypt it using Metamask (verify it)
  //  2.c. The decription is the public key - we need to check whether Metamask provides us such information during the 2nd api
  //  2.c. Need to verify if it's ok. I think we need to add a map in the user SC the clients that allowed a map which is:
  //  2.c. (user address) -> [clientIds]. So the 2nd API needs to add the clientId to the list of values of user addr key.
  //  2.c. Next step is to optimize it
  //  2.d. Once we have the public key (stored in cache) we can decrypt it and send in the 3rd API
  
  
  //2.a. We need to check how can we give grant to dapps  / accounts to use nft. This way we will achieve the open protocol:
  //     https://consensys.net/blog/metamask/the-seal-of-approval-know-what-youre-consenting-to-with-permissions-and-approvals-in-metamask/
  //2.b. 


}