## Jwt use
1. Send 2 jwt to the front-end
2. Main token is stored in a variable 
3. Refresh token is encrypted and stored in Cookie or session
4. Main token is used with every request
5. When the page is refreshed => no more main token so the refresh token is decrypted 
6. The refresh token will allow the front-end to have a new main token
7. If the refresh token is expired but the user made a recent request then the refresh token is accepted

## Password
1. React send plaintext password over HTTPS
2. Node hash & slat the password then stores it in the DB
3. Every time the user log's in Node compare the password from DB with the passsword from react
