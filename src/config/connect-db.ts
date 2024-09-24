import mongoose from 'mongoose';
import logger from '@logger';
import Env from '@env';

// Exit application on error
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

export default function connectDb() {
  mongoose.connect(Env.MONGODB_URI).then(() => console.log('MongoDB Connection Established'));
}
