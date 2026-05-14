import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import {
  ConflictException as DomainConflict,
  DomainException,
  EntityNotFoundException,
  UnauthorizedDomainException,
  ValidationException,
} from '../../domain/domain.exception';

interface ErrorBody {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  path: string;
  timestamp: string;
  requestId?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    logger.setContext(AllExceptionsFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { id?: string }>();

    const { statusCode, code, message, details } = this.normalize(exception);

    const body: ErrorBody = {
      statusCode,
      code,
      message,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId: request.id,
    };

    if (statusCode >= 500) {
      this.logger.error({ err: exception, body }, 'Unhandled exception');
    } else {
      this.logger.warn({ body }, 'Handled exception');
    }

    response.status(statusCode).json(body);
  }

  private normalize(exception: unknown): {
    statusCode: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        return { statusCode: status, code: 'HTTP_ERROR', message: res };
      }
      const obj = res as Record<string, unknown>;
      return {
        statusCode: status,
        code: (obj.code as string) ?? 'HTTP_ERROR',
        message:
          (obj.message as string) ??
          (Array.isArray(obj.message)
            ? (obj.message as string[]).join(', ')
            : exception.message),
        details: obj.errors ?? obj.details ?? undefined,
      };
    }

    if (exception instanceof EntityNotFoundException) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        code: exception.code,
        message: exception.message,
      };
    }
    if (exception instanceof ValidationException) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: exception.code,
        message: exception.message,
      };
    }
    if (exception instanceof DomainConflict) {
      return {
        statusCode: HttpStatus.CONFLICT,
        code: exception.code,
        message: exception.message,
      };
    }
    if (exception instanceof UnauthorizedDomainException) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        code: exception.code,
        message: exception.message,
      };
    }
    if (exception instanceof DomainException) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: exception.code,
        message: exception.message,
      };
    }

    const err = exception as Error;
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: err?.message ?? 'Internal server error',
    };
  }
}
