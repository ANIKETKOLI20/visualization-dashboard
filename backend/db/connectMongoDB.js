import mongoose from 'mongoose';

// Function to connect to MongoDB
const connectMongoDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    const connect = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongoose Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process on connection error
  }
};

export default connectMongoDB;
