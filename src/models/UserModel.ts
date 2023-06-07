/**
 * This file :
 * 1. Defines the User model schema.
 * 2. Configures pre-save hook that hashed the user's password before storing in database
 * 3. Declares isValidPassword method
 * 4. Declares generateJWT method
 */

import { Schema, Document, Model, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import IJwtPayload from '../interfaces/IJwtPayload';
import {
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    FIRST_NAME_MAX_LENGTH,
    LAST_NAME_MAX_LENGTH,
} from '../config/ValidationRules';

export interface IUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

/**
 * All user variables should be of this type
 */
export interface IUserDocument extends IUser, Document {
    isValidPassword: (password: string) => boolean;
    generateJWT: () => string;
    toJSON: () => IUser;
}

interface IUserModel extends Model<IUserDocument> {
    findByEmail: (email: string) => Promise<IUserDocument>;
}

const UserSchema: Schema<IUserDocument> = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            maxLength: EMAIL_MAX_LENGTH,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minLength: PASSWORD_MIN_LENGTH,
            maxLength: PASSWORD_MAX_LENGTH,
        },

        firstName: {
            type: String,
            required: true,
            maxLength: FIRST_NAME_MAX_LENGTH,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            maxLength: LAST_NAME_MAX_LENGTH,
            trim: true,
        },
    },
    { timestamps: true },
);

UserSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email });
};

/**
 * pre-save hook
 * is used to hash the user’s password using the bcrypt package whenever
 * a user is created or their password is changed before saving in the database.
 */
UserSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user: IUserDocument = this;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * isValidPassword method
 * is used to compare the password entered by the user during login to the user’s password currently in the database.
 */
UserSchema.methods.isValidPassword = function (password: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user: IUserDocument = this;
    return bcrypt.compareSync(password, user.password);
};

/**
 * generateJWT method
 * is used for creating the authentication tokens using the jwt package.
 * This token will be returned to the user and will be required for accessing protected routes.
 * The token jwtPayload is of IJwtPayload interface and is set to expire 60 days in the future.
 */
UserSchema.methods.generateJWT = function (): string {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user: IUserDocument = this;

    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    const jwtPayload: IJwtPayload = {
        _id: user._id,
        email: user.email,
    };

    const signOptions = {
        expiresIn: parseInt(String(expirationDate.getTime() / 1000), 10),
    };

    return jwt.sign(jwtPayload, process.env.JWT_SECRET, signOptions);
};

/**
 * toJSON method
 * is used to not return the attributes that should be hidden for serialization.
 */
export interface IUserSerialized {
    email: string;
    firstName: string;
    lastName: string;
}
UserSchema.methods.toJSON = function (): IUserSerialized {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user: IUserDocument = this;
    //const obj = user.toObject();
    //delete obj.password;
    //return obj;

    return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    };
};

const UserModel = model<IUserDocument, IUserModel>('User', UserSchema);

export default UserModel;
