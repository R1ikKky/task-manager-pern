const authService = require("../services/auth.service")

const register = async (req, res) => {
    try{
        const user = await authService.register(req.body)
        res.status(200).json(user)
    }catch(e){
        res.status(500).json({ error: e.message })
    }
}

const login = async (req, res) => {
    try{
        const { accessToken, refreshToken, user } = await authService.login(req.body)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            overwrite: true
          })
        res.status(200).json({accessToken, user})
    }catch(e){
        res.status(401).json({ error: e.message })
    }
}

const refresh = async(req, res) => {
    try{
        const token = req.cookies.refreshToken
        const data = await authService.refresh(token)
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 *1000,
            overwrite: true,
        })
        res.status(200).json(data)
    }catch(e){
        res.status(401).json({ error: e.message })
    }
}

const logout = async(req, res) => {
    try{
        const token = req.cookies.refreshToken
        await authService.logout(token)
        res.status(200).json( {message: "logged out"} )
    }
    catch(e){
        res.status(500).json({ error: e.message })
    }
}

module.exports = { register, login, refresh, logout }