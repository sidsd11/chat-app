import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true

    const [width, setWidth] = useState(window.innerWidth)
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [loading, setLoading] = useState(true)
    const [isFriendSelected, setIsFriendSelected] = useState(false)
    const [isFriendProfileSelected, setIsFriendProfileSelected] = useState(false)
    const [selectedFriendId, setSelectedFriendId] = useState('')

    const getUserData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/get-user-data`)
            if (data.success) {
                setUserData(data.userData)
            }
            else {
                setUserData(null)
            }
        }
        catch (error) {
            setUserData(null)
        }
    }

    useEffect(() => {
        const init = async () => {
            setAuthLoading(true)
            try {
                const {data} = await axios.get(`${backendUrl}/api/user/is-auth`)
                if (data.success) {
                    setIsLoggedIn(true)
                    await getUserData()
                }
                else {
                    setIsLoggedIn(false)
                    setUserData(null)
                }
            }
            catch (error) {
                toast.error(error.message)
                setIsLoggedIn(false)
                setUserData(null)
            }
            setLoading(false)
            setAuthLoading(false)
        }
        init()
    }, [])

    useEffect(() => {
        const handleResize = async () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        authLoading, setAuthLoading,
        loading, setLoading,
        isFriendSelected, setIsFriendSelected,
        isFriendProfileSelected, setIsFriendProfileSelected,
        selectedFriendId, setSelectedFriendId,
        width, setWidth
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}