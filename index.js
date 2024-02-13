import { Elysia, t } from "elysia";
import { User } from "./schema.js";
import jwt from "@elysiajs/jwt";
import cors from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";

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
    .use(
        jwt({
            alg: "HS384",
            name: "jwt",
            secret: "efgfnkgfkbkfbnjgsjnbaargldsdsdsdwwwiqoqodjdncxrgklerbknsdsdsdfffgfjhojnpspqxxhhjhjhj",
        })
    )
    .use(cookie())
    .onAfterHandle(({ request, set }) => {
        // Only process CORS requests
        if (request.method !== "OPTIONS") return;

        const allowHeader = set.headers["Access-Control-Allow-Headers"];
        if (allowHeader === "*") {
            set.headers["Access-Control-Allow-Headers"] = request.headers.get("Access-Control-Request-Headers") ?? "";
        }
    })
    .use(cors())
    .get(
        "/isfavpokemon/:id",
        async ({ params, set, jwt, cookie: { auth } }) => {
            const profile = await jwt.verify(auth);

            if (!profile) {
                set.status = 401;
                return "Unauthorized";
            }

            let usernameInput = "";

            for (const [key, value] of Object.entries(profile)) {
                usernameInput += value;
            }

            let returnBool = false;
            try {
                let currentUser = await User.findOne({ username: usernameInput });

                currentUser.favPokemonId.forEach((element) => {
                    if (element === params.id) {
                        returnBool = true;
                    }
                });
            } catch (error) {}

            set.status = 200;
            return returnBool;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
        }
    )
    .post(
        "/removefavpokemon",
        async ({ body, set, jwt, cookie: { auth } }) => {
            const profile = await jwt.verify(auth);

            if (!profile) {
                set.status = 401;
                return "Unauthorized";
            }

            let usernameInput = "";

            for (const [key, value] of Object.entries(profile)) {
                usernameInput += value;
            }

            let currentUser = await User.findOne({ username: usernameInput });

            for (let i = 0; i < currentUser.favPokemonId.length; i++) {
                if (currentUser.favPokemonId[i] === body.pokemonId) {
                    currentUser.favPokemonId.splice(i, 1);
                    currentUser.favPokemon.splice(i, 1);
                }
            }
            currentUser.save();

            set.status = 200;
            return;
        },
        {
            body: t.Object({
                pokemonId: t.Number(),
            }),
        }
    )
    .post(
        "/addfavpokemon",
        async ({ body, set, jwt, cookie: { auth } }) => {
            const profile = await jwt.verify(auth);

            if (!profile) {
                set.status = 401;
                return "Unauthorized";
            }

            let usernameInput = "";

            for (const [key, value] of Object.entries(profile)) {
                usernameInput += value;
            }

            let currentUser = await User.findOne({ username: usernameInput });
            currentUser.favPokemon.push(body.pokemon);
            currentUser.favPokemonId.push(body.pokemonId);
            currentUser.save();

            set.status = 200;
            return;
        },
        {
            body: t.Object({
                pokemon: t.String(),
                pokemonId: t.Number(),
            }),
        }
    )
    .get(
        "/isfavmove/:id",
        async ({ params, set, jwt, cookie: { auth } }) => {
            const profile = await jwt.verify(auth);

            if (!profile) {
                set.status = 401;
                return "Unauthorized";
            }

            let usernameInput = "";

            for (const [key, value] of Object.entries(profile)) {
                usernameInput += value;
            }

            let returnBool = false;

            try {
                let currentUser = await User.findOne({ username: usernameInput });
                currentUser.favMoveId.forEach((element) => {
                    if (element === params.id) {
                        returnBool = true;
                    }
                });
            } catch (error) {}

            set.status = 200;
            return returnBool;
        },
        {
            params: t.Object({
                id: t.Numeric(),
            }),
        }
    )
    .post(
        "/removefavmove",
        async ({ body, set, jwt, cookie: { auth } }) => {
            const profile = await jwt.verify(auth);

            if (!profile) {
                set.status = 401;
                return "Unauthorized";
            }

            let usernameInput = "";

            for (const [key, value] of Object.entries(profile)) {
                usernameInput += value;
            }

            let currentUser = await User.findOne({ username: usernameInput });

            for (let i = 0; i < currentUser.favMoveId.length; i++) {
                if (currentUser.favMoveId[i] === body.moveId) {
                    currentUser.favMoveId.splice(i, 1);
                    currentUser.favMove.splice(i, 1);
                }
            }
            currentUser.save();

            set.status = 200;
            return;
        },
        {
            body: t.Object({
                moveId: t.Number(),
            }),
        }
    )
    .post(
        "/addfavmove",
        async ({ body, set, jwt, cookie: { auth } }) => {
            const profile = await jwt.verify(auth);

            if (!profile) {
                set.status = 401;
                return "Unauthorized";
            }

            let usernameInput = "";

            for (const [key, value] of Object.entries(profile)) {
                usernameInput += value;
            }

            let currentUser = await User.findOne({ username: usernameInput });
            currentUser.favMove.push(body.move);
            currentUser.favMoveId.push(body.moveId);
            currentUser.save();

            set.status = 200;
            return;
        },
        {
            body: t.Object({
                move: t.String(),
                moveId: t.Number(),
            }),
        }
    )
    .get("/mypage", async ({ set, jwt, cookie: { auth } }) => {
        const profile = await jwt.verify(auth);

        if (!profile) {
            set.status = 401;
            return "Unauthorized";
        }

        let usernameInput = "";

        for (const [key, value] of Object.entries(profile)) {
            usernameInput += value;
        }

        let currentUser = await User.findOne({ username: usernameInput });
        let returnObj = {
            favPokemon: currentUser.favPokemon,
            favPokemonId: currentUser.favPokemonId,
            favMove: currentUser.favMove,
            favMoveId: currentUser.favMoveId,
        };

        set.status = 200;
        return returnObj;
    })
    .get(
        "/signin",
        async ({ headers, set, jwt, cookie, setCookie }) => {
            // gets the pasword and username
            let inputValueA = atob(headers.authorization.split(" ")[1]).split(":");

            //checks input for chars
            let incomingOkej = true;
            if (inputValueA[1].length < 8) {
                incomingOkej = false;
            } else if (inputValueA[1].length > 64) {
                incomingOkej = false;
            } else if (FindSpecialChars(inputValueA[1])) {
                incomingOkej = false;
            } else if (inputValueA[0].length < 3) {
                incomingOkej = false;
            } else if (inputValueA[0].length > 64) {
                incomingOkej = false;
            } else if (FindSpecialChars(inputValueA[0])) {
                incomingOkej = false;
            }

            if (incomingOkej) {
                let isMatch = false;
                try {
                    let currentUsers = await User.find({ username: inputValueA[0] }).orFail();
                    isMatch = await Bun.password.verify(inputValueA[1], currentUsers[0].password);
                } catch (error) {}

                if (isMatch === true) {
                    //JSW token
                    setCookie("auth", await jwt.sign(inputValueA[0]), {
                        maxAge: 7 * 864,
                    });
                    //user name
                    setCookie("username", inputValueA[0], {
                        maxAge: 7 * 864,
                    });

                    set.status = 200;
                    return "welcome";
                }
                set.status = 404;
                return "Wrong password or username";
            }

            set.status = 404;
            return "Wrong password or username";
        },
        {
            headers: t.Object({
                authorization: t.String(),
            }),
        }
    )
    .get(
        "/user/create",
        async ({ headers, set, jwt, cookie, setCookie }) => {
            // gets the pasword and username
            let inputValueA = atob(headers.authorization.split(" ")[1]).split(":");
            //checks input for chars
            let incomingOkej = true;
            if (inputValueA[1].length < 8) {
                incomingOkej = false;
            } else if (inputValueA[1].length > 64) {
                incomingOkej = false;
            } else if (FindSpecialChars(inputValueA[1])) {
                incomingOkej = false;
            } else if (inputValueA[0].length < 3) {
                incomingOkej = false;
            } else if (inputValueA[0].length > 64) {
                incomingOkej = false;
            } else if (FindSpecialChars(inputValueA[0])) {
                incomingOkej = false;
            }

            if (incomingOkej) {
                let usernameExist = await User.find({ username: inputValueA[0] });
                if (usernameExist.length == 0) {
                    const argonHash = await Bun.password.hash(inputValueA[1], {
                        algorithm: "argon2id",
                        memoryCost: 4, // memory usage in kibibytes
                        timeCost: 3, // the number of iterations
                    });

                    const newUser = new User({
                        username: inputValueA[0],
                        password: argonHash,
                    });
                    newUser.save();

                    //JSW token
                    setCookie("auth", await jwt.sign(inputValueA[0]), {
                        maxAge: 7 * 864,
                    });

                    //user name
                    setCookie("username", inputValueA[0], {
                        maxAge: 7 * 864,
                    });

                    set.status = 201;
                    return "user";
                }
                set.status = 400;
                return "username is used";
            }
            set.status = 400;
            return "Somting went wrong";
        },
        {
            headers: t.Object({
                authorization: t.String(),
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
