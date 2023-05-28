import { MongoClient } from "mongodb";

export async function connectDB(){
    const client = await MongoClient.connect('mongodb+srv://kunal:zO1lRwKvRnK7jJ9K@cluster0.hzibf2w.mongodb.net/');
    
    return client;
}