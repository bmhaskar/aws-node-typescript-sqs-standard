import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  send(body: string): string {
    return body;
  }
}
