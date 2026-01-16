export default () => ({
  port: parseInt(process.env.PORT ?? '8080', 10),
  environment: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  database: {
    postgres: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
      name: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      url: process.env.POSTGRES_URL ?? '',
    },
    mongo: {
      username: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  google: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callBackUrl: process.env.CALLBACK_URL,
  },
  aws: {
    doSpaceEnpoint: process.env.DO_SPACE_ENDPOINT,
    doSpaceAccessKey: process.env.DO_SPACE_ACCESS_KEY,
    doSpaceSecretKey: process.env.DO_SPACE_SECRET_KEY,
    doSpaceBucket: process.env.DO_SPACE_BUCKET,
    doSpaceRegion: process.env.DO_SPACE_REGION,
  },
})
