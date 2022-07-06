
export type IdTokenData = {
  iss: string,
  sub: string,
  aud: string,
  exp: number,
  iat: number,
  name: string,
  given_name: string,
  family_name: string,
  gender: string,
  birthdate: string,
  email: string,
  picture: string,
}


// {
//   "iss": "http://YOUR_DOMAIN/",
//   "sub": "auth0|123456",
//   "aud": "YOUR_CLIENT_ID",
//   "exp": 1311281970,
//   "iat": 1311280970,
//   "name": "Jane Doe",
//   "given_name": "Jane",
//   "family_name": "Doe",
//   "gender": "female",
//   "birthdate": "0000-10-31",
//   "email": "janedoe@example.com",
//   "picture": "http://example.com/janedoe/me.jpg"
// }