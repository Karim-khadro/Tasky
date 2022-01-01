## Jwt use
1. Send 2 jwt to the front-end
2. Main token is stored in a variable 
3. Refresh token is encrypted and stored in Cookie or session
4. Main token is used with every request
5. When the page is refreshed => no more main token so the refresh token is decrypted 
6. The refresh token will allow the front-end to have a new main token
7. If the refresh token is expired but the user made a recent request then the refresh token is accepted