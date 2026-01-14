import { JwtPayload } from '@src/common/interfaces'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get('jwt.secret')
    if (!secret) {
      throw new Error('JWT_SECRET is not set')
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  } 

  async validate(payload: JwtPayload) {
    return { id: payload.sub, role: payload.role }
  }
}
