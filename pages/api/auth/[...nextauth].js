import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { connectDB } from "../../../lib/db";
import { verifyUser } from "../../../lib/auth";

export default NextAuth({
    session: {
        jwt: true
    },
    providers: [
        Providers.Credentials({
            async authorize(credentials) {
                const client = await connectDB();
                const userCollection = client.db('next-auth').collection('users');
                const user = await userCollection.findOne({ email: credentials.email });

                if (!user) {
                    client.close();
                    throw new Error('User not found.');
                }

                const isVerified = verifyUser(credentials.password, user.password);

                if (!isVerified) {
                    client.close();
                    throw new Error("Password doesn't match");
                }

                client.close();
                return {
                    email: user.email
                }
            }
        })
    ]
});