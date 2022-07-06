import { Injectable } from '@nestjs/common';
import { IdTokenData } from './model/id-token-data.model';
import { ethers } from "ethers";
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

type ClientBasicDetails = {
  client_id: string,
  redirect_uri: string,
  client_code: string
}

@Injectable()
export class UserNftService {

  private contractAddress;

  constructor(private readonly httpService: HttpService) {
    this.contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //should be a property
  }

  async validateClientDetails(clientIdToVerify: string, redirectUriToVerify: string): Promise<void> {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      
      const daiAbi = [
        "function tokenURI(uint256 tokenId) public view returns (string)",
        "function getTokenUriByClientId(address clientId) external view returns(string)"
      ];

      const daiContract = new ethers.Contract(this.contractAddress, daiAbi, provider);
      const clientBasicDetailsUrl = await daiContract.getTokenUriByClientId(clientIdToVerify);

      const clientBasicDetailsResponse: AxiosResponse<ClientBasicDetails> = 
        await this.httpService.axiosRef.get(clientBasicDetailsUrl);

      const clientBasicDetails = clientBasicDetailsResponse.data;

      if (clientIdToVerify !== clientBasicDetails.client_id) {
        throw new Error(`ClientId ${clientIdToVerify} is not correct!`);
      }

      if (redirectUriToVerify !== clientBasicDetails.redirect_uri) {
        throw new Error(`RedirectUri ${redirectUriToVerify} is not suitable for the clientId ${clientBasicDetails.client_id}`);
      }
    } catch (error) {
      throw error;
    }
  }

  getUserAuthorizationDetails(clientId: string, userAddress: string): IdTokenData {
    //here we need to go to our smart contract and fetch it NFT data
    //https://auth0.com/docs/secure/tokens
 
    return {
      "iss": "http://YOUR_DOMAIN/",
      "sub": "auth0|123456",
      "aud": clientId,
      "exp": 1311281970,
      "iat": 1311280970,
      "name": "Jane Doe",
      "given_name": "Jane",
      "family_name": "Doe",
      "gender": "female",
      "birthdate": "1989-10-31",
      "email": `${userAddress}@cryptoauth.com`,
      "picture": "http://example.com/janedoe/me.jpg"
    }
  }


}
