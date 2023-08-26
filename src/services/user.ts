import {createHmac, randomBytes} from "node:crypto"
import { prismaCient } from "../lib/db"
import JWT from 'jsonwebtoken'
const JWT_SECRET = '$uperM@n@123'

export interface CreateUserPaylaod {
    firstName:string
    lastName?: string
    email:string
    password:string
}
export interface GetUserTokenPayload {
    email:string
    password:string
}

class UserService{
    private static generateHash(salt:string,password:string){
        const hashedPassword = createHmac('sha256',salt).update(password).digest("hex")
        return hashedPassword
    }


    public static createUser(payload:CreateUserPaylaod){
        const {firstName,lastName,email,password} = payload
        //we can add validation emails over here password should of minimum chars and email is valid

        const salt  = randomBytes(32).toString("hex")
        
        const hashedPassword = UserService.generateHash(salt,password)
        
        return prismaCient.user.create({
            data:{
                firstName,
                lastName,
                email,
                password:hashedPassword,
                salt

            }
        })
    }

    private static getUserByEmail(email:string) {
        return prismaCient.user.findUnique({where:{email}})
    }

   

    public static async getUserToken(payload:GetUserTokenPayload){
        const {email,password} = payload

        const user = await UserService.getUserByEmail(email)

        if(!user) throw new Error('user not found')

        const userSalt = user.salt
        const userHashPassword = UserService.generateHash(userSalt,password)

        if(userHashPassword !== user.password) throw new Error('Incorrect password')
        
        const token = JWT.sign({id:user.id,email:user.email},JWT_SECRET)
        return token
    }
}

export default UserService