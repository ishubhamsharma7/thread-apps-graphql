import UserService, { CreateUserPaylaod, GetUserTokenPayload } from "../../services/user";

const queries= {
    getUserToken : async(_:any,payload:{email:string;password:string}) => {
        const token = await UserService.getUserToken({email:payload.email,password:payload.password})
        return token
    },
    getCurrentLoggedInUser: async(_:any,params:any,context:any)=>{
        if(context && context.user) {
            const id = context.user.id
            const user = await UserService.getUserById(id)

            return user
        }
        throw new Error('i dont know you ')
    }
}

const mutation={
    createUser : async(_:any,payload:CreateUserPaylaod)=>{
        const res = await UserService.createUser(payload);
        return res.id
    }
};

export const resolvers = {queries,mutation}