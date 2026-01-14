import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common'
import { AuthService } from '@modules/auth/auth.service'
import { SignInDto, SignUpDto } from '@modules/auth/auth.dto'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthResponse } from '@common/interfaces'
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard'
import { Public } from '@modules/auth/decorators/public.decorator'
import { GoogleOauthGuard } from '@modules/auth/guards/google-oauth.guard'
import { ConfigService } from '@nestjs/config'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Sign In' })
  @ApiBody({ type: SignInDto })
  async signIn(@Request() req): Promise<AuthResponse> {
    const data = await this.authService.signIn(req.user)
    return data
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  @Public()
  @ApiOperation({ summary: 'Sign Up' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponse> {
    const data = await this.authService.signUp(signUpDto)
    return data
  }
  
  @Public()
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() _req) {}
  
  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res) {
    const clientUrl = this.configService.get('clientUrl')
    try {
      const data = await this.authService.oAuthSignIn(req.user)
      const userB64 = Buffer.from(JSON.stringify(data.user)).toString('base64')
      const redirectUrl = `${clientUrl}/auth/google/callback?user=${userB64}&token=${data.access_token}`
      return res.redirect(redirectUrl)
    } catch (error) {
      return res.redirect(`${clientUrl}/auth/google/callback?error=${error.message}`)
    }
  }
}
