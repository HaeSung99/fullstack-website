import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
        private jwtService: JwtService,
    ) {}

    async login(body: any) {
        const user = await this.authRepository.findOne({ where: { user_id: body.user_id } });
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 아이디입니다.');
        }
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        const payload = { user_id: user.user_id };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.authRepository.update(user.id, { refreshToken });
        return { accessToken, refreshToken };
    }

    async logout(req: Request) {
        const token = req.cookies?.accesstoken;
        if (!token) {
            throw new UnauthorizedException('토큰이 없습니다.');
        }
        // 1. 토큰 검증 및 user_id 추출
        const payload = this.jwtService.verify(token);
        // 2. user_id로 refreshToken 무효화
        await this.authRepository.update({ user_id: payload.user_id }, { refreshToken: null });
        return { success: true };
    }

    async refresh(refreshToken: string) {
        const user = await this.authRepository.findOne({ where: { refreshToken } });
        if (!user) {
            throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
        }
        // refreshToken도 만료 검증 필요 (jwtService.verify)
        try {
            this.jwtService.verify(refreshToken);
        } catch (e) {
            throw new UnauthorizedException('만료된 리프레시 토큰입니다.');
        }
        const payload = { user_id: user.user_id };
        const accessToken = this.jwtService.sign(payload);
        const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        await this.authRepository.update(user.id, { refreshToken: newRefreshToken });
        return { accessToken, newRefreshToken };
    }

    async getManager() {
        const managers = await this.authRepository.find({ select: ['id', 'user_id', 'name', 'role'] });
        return managers;
    }

    async createManager(body: any) {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const manager = await this.authRepository.create({
            user_id: body.user_id,
            password: hashedPassword,
            name: body.name,
            role: body.role,
        });
        await this.authRepository.save(manager);
        return manager;
    }

    async deleteManager(id: number) {
        const manager = await this.authRepository.findOne({ where: { id } });
        if (!manager) {
            throw new NotFoundException('관리자를 찾을 수 없습니다.');
        }
        await this.authRepository.delete(id);
        return manager;
    }
}
