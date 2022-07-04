import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // HTTP 프로토콜에 관한 logger 인스턴스를 만듬.

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.log(
        `미들웨어,  관련ip : ${req.ip},  요청메서드 : ${req.method},  상태코드 : ${res.statusCode},  url주소 : ${req.originalUrl}`,

      );
    });
    next();
  }
}
