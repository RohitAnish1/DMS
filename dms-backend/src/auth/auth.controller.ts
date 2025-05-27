import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role: string;
      phone: string;
      medicalRegistrationNumber: string;
    }
  ) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async me(@Request() req) {
    return req.user;
  }
}
