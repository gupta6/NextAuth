import { hash, compare } from "bcryptjs";

export async function encodeData(data){
    const hashedData = await hash(data, 12);
    return hashedData;
}

export async function verifyUser(password, hashedPassword){
    const isVerfied = await compare(password, hashedPassword);
    return isVerfied;
}

// export function decodeData(data){
//     const hashedData = await hash(data, 12);
//     return hashedData;
// }