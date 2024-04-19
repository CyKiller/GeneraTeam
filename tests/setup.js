const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri).catch(err => {
    console.error("MongoDB Memory Server connection error:", err.message);
    console.error(err.stack);
  });
  console.log("MongoDB Memory Server connected successfully");
});

afterAll(async () => {
  await mongoose.disconnect().catch(err => {
    console.error("MongoDB Memory Server disconnection error:", err.message);
    console.error(err.stack);
  });
  console.log("MongoDB Memory Server disconnected successfully");
  await mongoServer.stop().catch(err => {
    console.error("MongoDB Memory Server stopping error:", err.message);
    console.error(err.stack);
  });
  console.log("MongoDB Memory Server stopped successfully");
});