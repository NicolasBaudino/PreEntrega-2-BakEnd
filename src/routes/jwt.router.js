import { Router } from 'express';
import userModel from '../models/user.model.js';
import passport from 'passport';
import { isValidPas } from '../utils.js';
import { generateJWToken } from '../utils.js';

const router = Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        console.log("User found for login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "User not found with username: " + email });
        }
        if (!isValidPas(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "User and password don't match" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);

        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 60000,
                httpOnly: true
            }

        )
        res.send({ message: "Login success" })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Internal application error" });
    }

});

router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
    console.log("Registering user:");
    res.status(201).send({ status: "success", message: "User created" });
})


export default router;