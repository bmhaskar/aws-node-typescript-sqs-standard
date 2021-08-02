import { SQSHandler, SQSMessageAttributes } from 'aws-lambda';

import {NestFactory} from "@nestjs/core";
import {SmsService} from "../sms/sms.service";
import {INestApplicationContext} from "@nestjs/common";
import {SmsModule} from "../sms/sms.module";
let app: INestApplicationContext;
async function bootstrap(): Promise<INestApplicationContext> {
  if (!app) {
    app = await NestFactory.createApplicationContext(SmsModule, {
      // if a custom logger is supposed to be used, disable the default logger here
      logger: false,
    });
    // And in this case attach a custom logger
    // app.useLogger(app.get(Logger));

  }

  return app;
}
const receiver: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      const messageAttributes: SQSMessageAttributes = record.messageAttributes;
      if(messageAttributes?.AttributeNameHere?.stringValue)
      console.log('Message Attributtes -->  ', messageAttributes.AttributeNameHere?.stringValue);
      console.log('Message Body -->  ', record.body);


      // Injecting nest application
      /**
       * Setup the application context
       */
      const instance = await bootstrap();
      /**
       * Instantiate a request-scoped DI sub-tree and obtain the request-scoped top-level injectable
       */
      const smsService:SmsService = await instance.select<SmsModule>(SmsModule).get(SmsService);

      /**
       * Finally, do something with the event we received
       */
      console.log(smsService.send(record.body));
    }
  } catch (error) {
    console.log(error);
  }
};

export default receiver;
