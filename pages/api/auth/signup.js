import { connectDB } from "../../../lib/db";
import { encodeData } from "../../../lib/auth";

async function handler(req, res) {
    const data = req.body;
    const { email, password } = data;

    if (!email || !email.includes("@") || !password || password.trim().length < 7) {
        res.status('422').json({ msg: 'Invalid data' });
        client.close();
        return;
    }

    const client = await connectDB();
    const db = client.db('next-auth');

    const existingUser = await db.collection('users').findOne({ email: email });

    if (existingUser) {
        res.status('422').json({ msg: 'Email already exists.' });
        client.close();
        return;
    }

    const hashPassword = await encodeData(password);

    const result = await db.collection('users').insertOne({
        email: email,
        password: hashPassword
    });

    res.status(200).json({ msg: 'Successfully created!' });
    client.close();
}

export default handler;