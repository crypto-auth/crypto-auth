import { Injectable, Logger } from '@nestjs/common';	
import { ClientServiceAuthenticationModel as ClientAuthDetails } from './model/client-auth.model';
import { v4 as uuidGenerator } from 'uuid';
import { UserSignInModel as UserSignInModel } from './model/user-signin.model';
import { UserNftService } from 'src/blockchain/user-nft/user-nft.service';
import { AuthorizationTokenData } from './model/authorization-token-data.model';
import { sign as jwtSign } from 'jsonwebtoken';
import { IdTokenData } from './model/id-token-data.model';
import { UserAuthToken } from './model/user-auth-token.model';
import EthCrypto from 'eth-crypto';

type AuthDataBySessionId = {
  [sessionId: string]: ClientAuthDetails;
}

type AuthorizationCodeDetails = {
  [code: string]: string
}

@Injectable()	
export class AuthenticationService {	

  private static PRIVATE_KEY: string = "lala1212";

  private readonly logger = new Logger(AuthenticationService.name);	
  private latestNonces;
  private authDataBySessionId: AuthDataBySessionId;
  private authTokensByAddress;
  private authorizationCodeDetails: AuthorizationCodeDetails;


  constructor(private userNftService: UserNftService){
    this.latestNonces = [];
    this.authDataBySessionId = {};
    this.authTokensByAddress = {};
    this.authorizationCodeDetails = {};
  }


  async authenticateClient(clientAuthDetails: ClientAuthDetails): Promise<object> {

    if (this.latestNonces.includes(clientAuthDetails.nonce)) {
      throw new Error(`Double replay authentication attemp with same nonce ${clientAuthDetails.nonce}`);
    }

    this.latestNonces.push(clientAuthDetails.nonce);

    this.userNftService.validateClientDetails(clientAuthDetails.clientId, clientAuthDetails.redirectUri);

    const session: string = uuidGenerator().replace(/-/g, '');
    this.authDataBySessionId[session] = clientAuthDetails;

    const { state, redirectUri } = clientAuthDetails;
    return { session, state, redirectUri };
  }


  async signInUser(userSignInDetails: UserSignInModel): Promise<object> {

    this.validateClientIdIsAttachedToExistingSession(userSignInDetails);

    const userAddress: string = userSignInDetails.userAddress;
    const code = uuidGenerator().replace(/-/g, '');
    this.authorizationCodeDetails[code] = userAddress;
    
    return { code };
  }

  
  private validateClientIdIsAttachedToExistingSession(userSignInDetails: UserSignInModel) {
    const sessionClientId = this.authDataBySessionId[userSignInDetails.sessionId]?.clientId || null;
    const requestClientId = userSignInDetails.clientId;
    if (sessionClientId !== userSignInDetails.clientId) {
      throw new Error(`ClientId ${requestClientId} is not attached to any session!`);
    }
  }

  async exchangeAuthorizationTokenForAccessToken(authorizationTokenData: AuthorizationTokenData): Promise<UserAuthToken> {

    const { code, clientId, clientSecret, redirectUri, grantType } = authorizationTokenData;
    this.validateClientSecretIsRelatedToClientId(clientSecret, clientId);
    const userAddress = this.authorizationCodeDetails[code];

    const userAuthToken = this.generateUserAuthToken(clientId, userAddress);
    this.authTokensByAddress[userAddress] = userAuthToken;

    return userAuthToken;
  }
  
  private validateClientSecretIsRelatedToClientId(clientSecret: string, clientId: string): void {
  }


  private generateUserAuthToken(clientId: string, userAddress: string): UserAuthToken {
    const idToken: string = this.generateIdToken(clientId, userAddress);
    const accessToken: string = this.generateAccessToken();
    return {
      "access_token": accessToken,
      "id_token": idToken
    };
  }

  private generateIdToken(clientId: string, userAddress: string): string {
    const idDataTokenData: IdTokenData = this.userNftService.getUserAuthorizationDetails(clientId, userAddress);
    const idToken = jwtSign(idDataTokenData, AuthenticationService.PRIVATE_KEY);
    return idToken;
  }

  private generateAccessToken(): string {
    return "accessToken12345";
  }

  

}