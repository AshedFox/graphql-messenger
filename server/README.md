# GraphQL Messenger Server

Server based on GraphQL. Also uses Cloudinary as cloud storage.

## Environment Variables

To run this project, you will need to add the following 
environment variables to your .env file:

- `PORT` - server port (not required, default is 3000)
- `DATABASE_URL` - database url in format ***postgresql://user:password@host:port/db_name***
- `SSL_ENABLED` - true or false, indicates if db connection requires ssl
- `SECRET` - secret for tokens generation
- `ACCESS_TOKEN_LIFETIME` - lifetime of access tokens (in seconds)
- `REFRESH_TOKEN_LIFETIME` - lifetime of refresh tokens (in days)
- `ISSUER` - name of access token issuer
- `AUDIENCE` - name of access token audience
- `CLOUD_NAME` - Cloudinary cloud name
- `API_KEY` - Cloudinary API key
- `API_SECRET` - Cloudinary API secret
