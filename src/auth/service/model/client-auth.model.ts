type AuthResponseType = "code";
type ScopeType = "openid email | email openid";

export type ClientServiceAuthenticationModel = {
  clientId: string, 
  responseType: string, 
  scope: string,
  redirectUri: string,
  state: string,
  nonce: string
}