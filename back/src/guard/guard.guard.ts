import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class GuardGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.accesstoken;
    if (!token) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }
    try {
      // 토큰 검증 (유효하지 않으면 예외 발생)
      this.jwtService.verify(token);
      return true;
    } catch (e) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
