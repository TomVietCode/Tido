import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { SignInDto, SignUpDto } from '@/modules/auth/auth.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BackendResponse, AuthResponse } from '@/common/interfaces';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { Public } from '@/modules/auth/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOperation({ summary: 'Sign In' })
  @ApiBody({ type: SignInDto })
  async signIn(@Request() req): Promise<BackendResponse<AuthResponse>> {
    const data = await this.authService.signIn(req.user);
    return {
      statusCode: 200,
      message: 'Sign in successfully',
      data,
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("signup")
  @Public()
  @ApiOperation({ summary: 'Sign Up' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<BackendResponse<AuthResponse>> {
    const data = await this.authService.signUp(signUpDto);
    return {
      statusCode: 201,
      message: 'Sign up successfully',
      data,
    }
  }
}
