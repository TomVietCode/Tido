  export default () => ({
    port: parseInt(process.env.PORT ?? '8080', 10),
    environment: process.env.NODE_ENV,
    database: {
      postgres: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
        name: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
      },
      mongo: {
        username: process.env.MONGO_USER,
        password: process.env.MONGO_PASSWORD,
      }
    }
  })