const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { v4, uuidv4 } = require("uuid")
const prisma = require("../../prisma")

const generateTokens = (user) => {
    const playload = {id: user.id, email: user.email }

    const accessToken = jwt.sign(playload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
    })

    const refreshToken = jwt.sign(playload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"
    })
    return { accessToken, refreshToken }
}

const register = async ({email, userName, password}) => {
    const existing = await prisma.user.findUnique({ where: {email} })
    if (existing) throw new Error("A user with this email already exists.")

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create( {data: { email, userName, password: hashed } })

    return { id: user.id, email: user.email, userName: user.userName }
}

const login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({where: {email} })
    if(!user) throw new Error("Incorrect email or password")

    const isValid = bcrypt.compare(password, user.password)
    if(!isValid) throw new Error("Incorrect email or password")

    const { accessToken, refreshToken } = generateTokens(user)

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    })

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            userName: user.userName,
        }
    }
}

const refresh = async (token) => {
    if(!token) throw new Error("Refresh token absense")

    let playload
    try{
        playload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    }catch(err){
        throw new Error("Invalid refresh token")
    }

    const user = await prisma.user.findUnique({ where: {id: playload.id} })
    if(!user || user.refreshToken !== token) throw new Error("Invalid refresh token")

    const { accessToken, refreshToken } = generateTokens(user)

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    })
    return {
        accessToken,
        refreshToken,
        user: { id:user.id, email:user.email, userName:user.userName }
    }
}
const logout = async (token) => {
    try{
        const playload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        await prisma.user.update({
            where: { id: playload.id },
            data: { refreshToken: null},
        })
    } catch{

    }
}

module.exports = {
    register,
    login,
    refresh,
    logout
}

