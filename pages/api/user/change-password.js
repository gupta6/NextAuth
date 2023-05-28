import { getSession } from "next-auth/client";
import { connectDB } from "../../../lib/db";
import { encodeData, verifyUser } from "../../../lib/auth";

async function handler(req, res) {
    if (req.method !== "PATCH") {
        return;
    }

    const session = await getSession({ req: req });

    if (!session) {
        res.status(401).json({ msg: "Not authenticated." });
        return;
    }

    const { oldPassword, newPassword } = req.body;
    console.log('sess',session);

    const email = session.user.email;

    if (!oldPassword.trim() || !newPassword.trim()) {
        res.status(422).json({ msg: "Fields can't be empty" });
        return;
    }
    if (newPassword.trim().length < 8) {
        res.status(422).json({ msg: 'Password must be atleast 8 characters long.' });
        return;
    }

    const client = await connectDB();
    const userCollection = client.db('next-auth').collection('users');
    const user = await userCollection.findOne({ email: email });


    if (!user) {
        res.status(404).json({ msg: "User not found." });
        client.close();
        return;
    }

    const isVerified = await verifyUser(oldPassword, user.password);

    if (!isVerified) {
        res.status(422).json({ msg: "Password doesn't match." });
        client.close();
        return;
    }

    const hashedPassword = await encodeData(newPassword);
    const result = await userCollection.updateOne({ email: email }, { $set: { password: hashedPassword } });

    client.close();
    res.status(200).json({ msg: "Successfully updated!" });
}

export default handler;