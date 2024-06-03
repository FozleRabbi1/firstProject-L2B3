import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`Example app listening on PORT === ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

// =====>>> express বা যেকোনো internal বা tecnical problem এর কারনে এই unhandledRejection error টি হয়ে থাকে
process.on('unhandledRejection', () => {
  console.log('unhandledRejection id detected, shutting down the server....');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// =====>>> আমাদের problem এর কারনে এই uncaughtException error টি হয়ে থাকে , ( এটি syncronous code এর ক্ষেত্রে প্রযোজ্য )
process.on('uncaughtException', () => {
  console.log('uncaughtException id detected, shutting down the server....');
  process.exit(1);
});

