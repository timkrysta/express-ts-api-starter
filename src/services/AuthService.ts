import User from '../models/UserModel';
import { ACCOUNT_ALREADY_EXISTS, INVALID_CREDENTIALS } from '../config/Messages';

export default class AuthService {
    public static async registerUser(email: string, password: string, firstName: string, lastName: string) {
        try {
            const user = await User.findByEmail(email);

            // Make sure this account doesn't already exist
            if (user) {
                return { error: ACCOUNT_ALREADY_EXISTS };
            }

            // Create and save a new user
            const newUser = new User({
                email,
                password,
                firstName,
                lastName,
            });
            const savedUser = await newUser.save();

            return { token: savedUser.generateJWT() };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public static async loginUser(email: string, password: string) {
        try {
            const user = await User.findByEmail(email);

            if (!user || !user.isValidPassword(password)) {
                return { error: INVALID_CREDENTIALS };
            }

            // Login successful, write token, and send back user
            return { token: user.generateJWT() };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
