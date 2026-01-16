/* eslint-disable */
export default async () => {
  const t = {}
  return {
    '@nestjs/swagger': {
      models: [],
      controllers: [
        [
          import('./app.controller'),
          { AppController: { getHello: { type: String } } },
        ],
        [
          import('./modules/auth/auth.controller'),
          { AuthController: { signIn: { type: Object }, signUp: {} } },
        ],
        [
          import('./modules/users/users.controller'),
          {
            UsersController: { getUsers: {}, findByEmail: {}, createUser: {} },
          },
        ],
      ],
    },
  }
}
