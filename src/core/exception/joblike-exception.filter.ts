import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

interface ExceptionDetails { 
  status: number, 
  message: string,
}

@Catch()
export class JoblikeExceptionFilter<T> implements ExceptionFilter {

  private readonly logger = new Logger(JoblikeExceptionFilter.name);


  catch(exception: T, host: ArgumentsHost) { 

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { meta, path } = ctx.getRequest();

    const { status, message } = this.getStatusAndMessage(exception);
    
    const error = { status, message, path };

    response.status(status).json({meta, error});

    this.logger.error(`Got an error: ${exception}`);
  }

  private getStatusAndMessage(exception: T): ExceptionDetails {
    return (exception instanceof HttpException) ? this.getHttpExcptStsAndMsg(exception) : this.getEternalExcptStsAndMsg();
  }

  private getHttpExcptStsAndMsg(exception: HttpException): ExceptionDetails {
    const status = exception.getStatus();
    const message = exception.message;
    return { status, message };
  }

  private getEternalExcptStsAndMsg(): ExceptionDetails {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = "Internal Server Error";
    return { status, message };
  }

}
