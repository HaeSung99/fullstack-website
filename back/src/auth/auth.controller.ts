import { Body, Controller, Delete, Get, Param, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  async login(@Body() body: any, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(body);
    res.cookie('accesstoken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // 운영환경에서만 사용
    });
    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // 운영환경에서만 사용
    });
    res.json({ success: true });
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    res.json({ success: false, message: 'JWT 미사용' });
  }

  @Get('me')
  @ApiOperation({ summary: '토큰 검증' })
  async me(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies?.accesstoken;
    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }
    try {
      this.jwtService.verify(token);
      res.json({ success: true, message: 'JWT 사용' });
    } catch (e) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('accesstoken', { path: '/' });
    res.clearCookie('refreshtoken', { path: '/' });
    await this.authService.logout(req);
    res.json({ success: true });
  }

  @Get('manager')
  @ApiOperation({ summary: '관리자 목록 조회' })
  async getManager(@Req() req: Request, @Res() res: Response) {
    const managers = await this.authService.getManager();
    res.json({ success: true, data: managers });
  }

  @Post('manager')
  @ApiOperation({ summary: '관리자 추가' })
  async createManager(@Body() body: any, @Res() res: Response) {
    const manager = await this.authService.createManager(body);
    res.json({ success: true, data: manager });
  }

  @Delete('manager/:id')
  @ApiOperation({ summary: '관리자 삭제' })
  async deleteManager(@Param('id') id: number, @Res() res: Response) {
    const manager = await this.authService.deleteManager(id);
    res.json({ success: true, data: manager });
  }
}
