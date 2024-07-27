import mongoose from "mongoose";

// making connection string 
let connectionString = process.env.MONGO_URI;
connectionString = connectionString?.replace(
  "<username>",
  process.env.MONGO_USER_NAME!
);
connectionString = connectionString?.replace(
  "<password>",
  process.env.MONGO_USER_PASSWORD!
);
connectionString = `${connectionString}/${process.env.DB_NAME}?${process.env.QUERY_STRING}`;

const connect = async () => {   
    const connectionState = mongoose.connection.readyState
    if (connectionState === 1) {
        console.log("Database Already Connected")
        return
    }
    if (connectionState === 2) {
        console.log("Connecting to the Database...")
        return
    }
    // connect to the databae 
    try {
        await mongoose.connect(connectionString, {bufferCommands: true})
        console.log("Database Connected")
    } catch (error:any) {
        console.log("Error", error.message)
    }
}
export default connect