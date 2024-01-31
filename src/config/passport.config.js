import passport from 'passport';
import passportLocal from 'passport-local';
import GitHubStrategy from "passport-github2"
import userModel from '../models/user.model.js';
import { createHash, isValidPas } from '../utils.js';
import jwtStrategy from "passport-jwt";
import { PRIVATE_KEY } from "../utils.js";

const localStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
    
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            try {
                console.log("JWT obtained from Payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));


    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user)
        } catch (error) {
            console.error("Error deserializing the user: " + error);
        }
    });
}

const cookieExtractor = (req) => {
    let token = null;
    console.log("Cookie Extractor");
    if (req && req.cookies) {
        console.log("Cookies: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtained from Cookie:");
        console.log(token);
    }
    return token;
};

export default initializePassport;