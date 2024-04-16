import { NotUniqueError, UserNotFound, ValidationError } from "../errors/userErrors";
import { createToken } from "../utility/createToken";
import User from "../models/User"
import UserService from "../services/user"
import { isCorrectPassword } from "../utility/passwordCheck";
import { config } from "dotenv";

config()

class UserController {
    private userService: UserService; // lazy

    constructor() {
        this.userService = new UserService()
    }

    get = async (request: any, response: any) => {
        try {
            const user: User | UserNotFound = await this.userService.getById(Number(request.params.id))
            response.status(200).json(user)
        } catch (error) {
            response.status(404).json({"response": "error", "error_message": error.message})
            return
        }
    }

    create = async (request: any, response: any) => {
        try {
            const user: User | ValidationError | NotUniqueError = await this.userService.createUser(request.body)
            
            const token = createToken(user.id)
            response.cookie('jwt', token, {httpOnly: true, maxAge: Number(process.env.TOKEN_AGE_MS)})
            
            response.status(200).json({'response': "success", 'userId': user.id})
            console.log(token)
            return
        } catch (error) {
            response.status(400).json({'response': 'error', 'error_message': error.message})
            return
        }
        
    }

    login = async (request: any, response: any) => {
        try {
            const user: User | UserNotFound = await this.userService.getByEmail(request.body.email)
            if (!isCorrectPassword(request.body.password, user.password)) {
                throw Error("Passwords don't match")
            }
            const token = createToken(user.id)
            response.cookie('jwt', token, {httpOnly: true, maxAge: Number(process.env.TOKEN_AGE_MS)})
            response.status(200).json({'response': "Success", 'userId': user.id})
        } catch (error) {
            response.status(405).json({'error': error.message})
        }
     }

    privatePage = async (request: any, response: any) => {
        response.status(200).json({'response': "Success", 'content': `Very protected auth only content for userID = ${response.locals.uId}`})
    }

    logout = async (request: any, response: any) => {
        response.cookie('jwt', '', { maxAge: 1 })
        response.status(200).json({'response': "Success", 'content': 'Cleaned current authorization'})
    }

}

export default UserController