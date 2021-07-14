import axios from 'axios'
import apiUrl from './apiConfig'
import apiVersion from './apiVersion'


//boilerplate auth code from a previous project
//we will focus on this once the front end is working properly
//and realstically, we will probably swap 90% of this out for something else

export const api = axios.create({
    baseURL: apiUrl + apiVersion
})

export const isBrowser = () => typeof window !== "undefined"

export const getLoggedInUser = () =>
    (
        isBrowser() && window.localStorage.getItem("ListenWumb")
            ? JSON.parse(window.localStorage.getItem("ListenWumb"))
            : {}
    )

const setUser = (user) =>
{
    window.localStorage.setItem("ListenWumb", JSON.stringify(user))
}

export const handleLogin = async ({ email, password }, callback) =>
{
    try
    {
        let response = await axios.post(`${apiUrl}${apiVersion}/auth`, {
            email: email,
            password: password
        })

        if (response.status === 200)
        {
            api.defaults.headers.common.authorization = `Bearer ${response.data.token}`
            setUser({
                token: response.data.token,
                name: response.data.name,
                id: response.data.id,
                avatarUrl: response.data.avatarUrl
            })
            callback()
        }
        // return false
    } catch (error)
    {
        console.log(error)
    }
}

export const handleSignup = async ({ email, password, name, location, picture_url }, callback) =>
{
    try
    {
        // The registration route is not name spaced inside /api/v1 and so it POSTS to /users
        let response = await axios.post(`${apiUrl}/users`, {
            email: email,
            password: password,
            name: name,
            location: location,
            picture_url: picture_url
        })

        if (response.status === 200)
        {
            api.defaults.headers.common.authorization = `Bearer ${response.data.token}`
            setUser({
                token: response.data.token,
                name: response.data.name,
                id: response.data.id,
                avatarUrl: response.data.avatarUrl
            })
            callback()
        }
        // return false
    } catch (error)
    {
        console.log(error)
    }
}

export const isLoggedIn = () =>
{
    const user = getLoggedInUser()
    api.defaults.headers.common.authorization = `Bearer ${user.token}`
    return !!user.token
}

export const logout = async callback =>
{
    await setUser({})
    api.defaults.headers.common.authorization = ""
    callback()
}