import React from 'react'
import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LogIn } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import assets from '../assets/assets'
import toast from 'react-hot-toast'

const Navbar = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const currPage = useLocation().pathname
    const {backendUrl, userData, setUserData, setIsLoggedIn, authLoading} = useContext(AppContext)

    /* Logout */
    const logout = async () => {
        try {
            const {data} = await axios.post(`${backendUrl}/api/user/logout`)
            if (data.success) {
                setIsLoggedIn(false)
                setUserData(null)
                navigate('/')
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    return (
        authLoading
        ? (
            <div className='w-full flex fixed top-0 justify-between items-center p-6 sm:p-8 sm:px-24 bg-white shadow-lg'>
                <img src={assets.logo} onClick={() => navigate('/')} className='transition-all cursor-pointer hover:scale-110 w-30 sm:w-40'/>
            </div>
        ) :
        (
            <div className='w-full flex fixed top-0 justify-between items-center p-6 sm:p-8 sm:px-24 bg-white shadow-lg'>
            <img src={assets.logo} onClick={() => navigate('/')} className='transition-all cursor-pointer hover:scale-110 w-30 sm:w-40'/>
                {
                    userData
                    ? (
                        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>
                            {userData?.name[0].toUpperCase()}
                            <div className='absolute hidden group-hover:block top-0 right-0 z-10 rounded pt-10 text-black'>
                                <ul className='list none m-0 p-2 txt-sm rounded-2xl border border-black bg-linear-to-br from-green-50 to-green-100'>
                                    {
                                        currPage !== '/profile' &&
                                        <li onClick={() => navigate('/profile')} className='py-2 px-2 whitespace-nowrap rounded-lg transition-all cursor-pointer hover:bg-green-300 hover:scale-105'>
                                            Profile
                                        </li>
                                    }
                                    {
                                        currPage !== '/chats' &&
                                        <li onClick={() => navigate('/chats')} className='py-2 px-2 whitespace-nowrap rounded-lg transition-all cursor-pointer hover:bg-green-300 hover:scale-105'>
                                            Chats
                                        </li>
                                    }
                                    {
                                        <li onClick={logout} className='py-2 px-2 whitespace-nowrap rounded-lg transition-all cursor-pointer hover:bg-green-300 hover:scale-105'>
                                            Logout
                                        </li>
                                    }
                                </ul>
                            </div>
                        </div>
                    ) :
                    (
                        currPage !== '/login' && (
                            <button onClick={() => navigate('/login')} className='flex justify-center gap-1 sm:gap-2 items-center transition-all border-2 border-green-400 rounded-full px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-xl text-black hover:bg-green-400 hover:scale-110 active:scale-95 cursor-pointer w-auto'>
                                Login <LogIn className='size-5'/>
                            </button>
                        )
                    )
                }
            </div>
        )
    )
}

export default Navbar