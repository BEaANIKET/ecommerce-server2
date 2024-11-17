import passport from "passport"


export const googleAuth = async (req, res) => {
    passport.authenticate("google", {scope: ["profile", "email"]})
}