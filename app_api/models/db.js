const mongoose = require('mongoose'); 
const host = process.env.DB_HOST || '127.0.0.1'; 
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline'); 

// Connect to MongoDB immediately
mongoose.connect(dbURI)
  .then(() => console.log(`Mongoose connected to ${dbURI}`))
  .catch(err => console.log('Mongoose connection error: ', err));

// Monitor connection events 
mongoose.connection.on('connected', () => { 
    console.log(`Mongoose connected to ${dbURI}`); 
}); 

mongoose.connection.on('error', err => { 
    console.log('Mongoose connection error: ', err); 
}); 

mongoose.connection.on('disconnected', () => { 
    console.log('Mongoose disconnected'); 
}); 

// Windows specific listener 
if (process.platform === 'win32') { 
    const r1 = readLine.createInterface({ 
        input: process.stdin, 
        output: process.stdout 
    }); 
    r1.on('SIGINT', () => { 
        process.emit("SIGINT"); 
    }); 
} 

// Configure graceful shutdown 
const gracefulShutdown = (msg) => { 
    mongoose.connection.close(() => { 
        console.log(`Mongoose disconnected through ${msg}`); 
    }); 
}; 

// Nodemon restart
process.once('SIGUSR2', () => { 
    gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2'); 
}); 

// App termination
process.on('SIGINT', () => { 
    gracefulShutdown('app termination'); 
    process.exit(0); 
}); 

// Container termination
process.on('SIGTERM', () => { 
    gracefulShutdown('app shutdown'); 
    process.exit(0); 
}); 

// Import Mongoose schemas
require('./travlr');
require('./user');

module.exports = mongoose;