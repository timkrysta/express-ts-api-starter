/**
 * This middleware creates and configures the Passport JWT authentication strategy.
 * `fromAuthHeaderAsBearerToken()` creates a new extractor that looks for the JWT in the authorization header with the scheme `bearer`
 *
 * Ref: https://www.passportjs.org/packages/passport-jwt/#usage
 */

import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback, StrategyOptions } from 'passport-jwt';
import { PassportStatic } from 'passport';
import HTTPStatus from 'http-status';
import IJwtPayload from '../interfaces/IJwtPayload';
import User from '../models/UserModel';

export default class PassportJwtStrategyMiddleware {
    private static strategyOptions: StrategyOptions = {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    public static initialize(passport: PassportStatic) {
        passport.use(
            new JwtStrategy(PassportJwtStrategyMiddleware.strategyOptions, PassportJwtStrategyMiddleware.verifyCallback),
        );
    }

    private static async verifyCallback(jwtPayload: IJwtPayload, done: VerifiedCallback) {
        try {
            const user = await User.findById(jwtPayload._id);
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (err) {
            return done(err, false, { message: HTTPStatus[HTTPStatus.INTERNAL_SERVER_ERROR] });
        }
    }
}
