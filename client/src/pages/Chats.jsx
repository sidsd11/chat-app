import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader } from 'lucide-react'

import { AppContext } from '../context/AppContext'
import Friends from '../components/Friends'
import SingleChat from '../components/SingleChat'
import UserDetails from '../components/UserDetails'
import Navbar from './Navbar'

const Chats = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {isLoggedIn, getUserData, authLoading, width, isFriendSelected, isFriendProfileSelected} = useContext(AppContext)

    useEffect(() => {
        const init = async () => {
            try {
                if (!isLoggedIn && !authLoading) {
                    navigate('/login')
                }
            }
            catch (error) {
                toast.error(error.message)
            }
            getUserData()
        }
        init()
    }, [isLoggedIn, authLoading])

    return (
        authLoading
        ? (
            <div className='flex flex-col min-h-screen justify-center items-center'>
                <h1 className='text-3xl text-center font-semibold mb-5'>
                    Loading your page
                </h1>
                <Loader className='animate-spin'/>
            </div>
        ) : (
            <div className='flex flex-col min-h-screen items-center justify-center'>
                <Navbar />
                <div className='flex items-center justify-center mt-24 min-h-[calc(100vh-96px)] w-[70%]'>
                    {
                        width >= 1024
                        ? (
                            <div className='grid grid-cols-[20%_60%_20%] gap-1 w-full h-[60vh]'>
                                <Friends />
                                <SingleChat />
                                <UserDetails />
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 w-full h-[70vh]'>
                                {
                                    !isFriendSelected && !isFriendProfileSelected &&
                                    <Friends />
                                }
                                {
                                    isFriendSelected && !isFriendProfileSelected &&
                                    <SingleChat />
                                }
                                {
                                    isFriendSelected && isFriendProfileSelected &&
                                    <UserDetails />
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        )
    )
}

export default Chats