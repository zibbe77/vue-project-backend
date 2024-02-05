import { Elysia, t } from "elysia";
import { Mongoose, Schema } from "mongoose";
import { cors } from "@elysiajs/cors";
import { User } from "/Users/zibell.theo/mina-projekt/Bun_Repos/vue-project-backend/schema.js";
import jwt from "@elysiajs/jwt";

const uri = "mongodb+srv://zibelltheo:vFdMNcyExxMfbOy4@cluster0.lobxbrj.mongodb.net/?retryWrites=true&w=majority";
const allowedCharsArray = [
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "å",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "ö",
    "ä",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "Å",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "k",
    "L",
    "Ö",
    "Ä",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "_",
];
//funktions
//------------------------------

//checks all allowed chars
function FindSpecialChars(string) {
    let specialCharBool = false;
    for (let i = 0; i < string.length; i++) {
        let foundChar = false;
        allowedCharsArray.forEach((element) => {
            if (string[i] === element) {
                foundChar = true;
            }
        });
        if (foundChar === false) {
            specialCharBool = true;
        }
    }
    return specialCharBool;
}

//routes
//-------------------------------

const app = new Elysia()
    .use(cors())
    .use(
        jwt({
            name: "jwt",
            secret: "idk what this does",
        })
    )
    .get("/signin", ({ headers }) => {
        console.log(atob(headers.authorization.split(" ")[1]).split(":")[1]);
    })
    .post(
        "/user",
        async ({ body, set }) => {
            let incomingOkej = true;
            if (body.inputpassword.length < 8) {
                incomingOkej = false;
            } else if (body.inputpassword.length > 64) {
                incomingOkej = false;
            } else if (FindSpecialChars(body.inputpassword)) {
                incomingOkej = false;
            } else if (body.inputusername.length < 3) {
                incomingOkej = false;
            } else if (body.inputusername.length > 64) {
                incomingOkej = false;
            } else if (FindSpecialChars(body.inputusername)) {
                incomingOkej = false;
            }

            if (incomingOkej === true) {
                let currentUsers = await User.find({ username: body.inputusername });

                //console.log(currentUser);
                const isMatch = await Bun.password.verify(body.inputpassword, currentUsers[0].password);
                if (isMatch === true) {
                    set.status = 200;
                    return "welcome";
                }
                set.status = 404;
                return "Wrong pasword or usernamn";
            }
            set.status = 400;
            return;
        },
        {
            body: t.Object({
                inputusername: t.String(),
                inputpassword: t.String(),
            }),
        }
    )
    .post(
        "/user/creat",
        async ({ body, set }) => {
            //verifie
            let incomingOkej = true;

            if (body.inputpassword.length < 8) {
                incomingOkej = false;
            } else if (body.inputpassword.length > 64) {
                incomingOkej = false;
            } else if (FindSpecialChars(body.inputpassword)) {
                incomingOkej = false;
            } else if (body.inputusername.length < 3) {
                incomingOkej = false;
            } else if (body.inputusername.length > 64) {
                incomingOkej = false;
            } else if (FindSpecialChars(body.inputusername)) {
                incomingOkej = false;
            }

            if (incomingOkej === true) {
                const argonHash = await Bun.password.hash(body.inputpassword, {
                    algorithm: "argon2id",
                    memoryCost: 4, // memory usage in kibibytes
                    timeCost: 3, // the number of iterations
                });

                const newUser = new User({
                    username: body.inputusername,
                    password: argonHash,
                    id: Math.floor(Math.random() * Number.MAX_VALUE),
                });
                newUser.save();
                set.status = 201;
                return "user! :D";
            }
            set.status = 400;
            return "Somting went wrong";
        },
        {
            body: t.Object({
                inputusername: t.String(),
                inputpassword: t.String(),
            }),
        }
    )
    .listen(8080);

const mongoose = require("mongoose");
async function main() {
    await mongoose.connect(uri);
    console.log("connected to mongoose 🪿");
}

console.log(`🦊 Elysia is running at on port ${app.server?.port}...`);
main().catch((err) => console.log(err));
//await User.collection.drop();
