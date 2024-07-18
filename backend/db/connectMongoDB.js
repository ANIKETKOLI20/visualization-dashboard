import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose Connected");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

export default connectMongoDB;
