

'use strict';

const mongoose = require('mongoose');
const env      = require('./env');   


const connectDB = async () => {

 
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS:          45000,
    family:                   4,
  };

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, options);

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);

  } catch (error) {
   
    console.error(`❌  MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️   MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅  MongoDB reconnected.');
});


const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing MongoDB connection...`);
  await mongoose.connection.close();
  console.log('MongoDB connection closed. Exiting process.');
  process.exit(0);  
  
};

process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = connectDB;