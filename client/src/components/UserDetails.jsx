import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, CircleX } from 'lucide-react'

import { AppContext } from '../context/AppContext'

const UserDetails = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, authLoading, isFriendSelected, setIsFriendSelected, isFriendProfileSelected, setIsFriendProfileSelected, selectedFriendId, width} = useContext(AppContext)
    const [userDetails, setUserDetails] = useState(null)

    const getFriendData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/get-single-user-data/${selectedFriendId}`)
                if (data.success) {
                    setUserDetails(data.userData)
                }
                else {
                    toast.error(data.message)
                    setUserDetails(null)
                }
            }
            catch (error) {
                toast.error(error.message)
                setUserDetails(null)
        }
    }

    useEffect(() => {
        if (authLoading) {
            return
        }

        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        if (!isFriendSelected || !selectedFriendId) {
            return
        }

        getFriendData()
    }, [isLoggedIn, authLoading, selectedFriendId, isFriendSelected, isFriendProfileSelected])

    return (
        isFriendSelected && isFriendProfileSelected
        ? (
            <div className='h-full flex flex-col rounded-lg text-black bg-green-300 overflow-hidden'>
                <div className='h-[10%] bg-green-500 flex items-center px-4 text-sm font-semibold rounded-t-lg'>
                    {
                        width < 1024 && (
                            <ArrowLeft
                            className='size-5 mr-5 cursor-pointer transition-all hover:scale-105 active:scale-95'
                            onClick={() => {
                                setIsFriendSelected(true)
                                setIsFriendProfileSelected(false)
                            }} />
                        )
                    }
                    <p className='w-full'>
                        {userDetails?.name}'s Details
                    </p>
                    {
                        width >= 1024 && (
                            <CircleX
                            className='size-5 mr-5 cursor-pointer transition-all hover:scale-105 active:scale-95 z-10'
                            onClick={() => {
                                setIsFriendSelected(true)
                                setIsFriendProfileSelected(false)
                            }} />
                        )
                    }
                </div>

                <div className='h-[90%] overflow-y-auto p-3 space-y-2'>
                    <div className='flex items-start justify-between gap-2 px-4 py-3 text-sm'>
                        <p className='flex-1 min-w-0 break-all whitespace-normal leading-snug'>
                            Name: {userDetails?.name}
                        </p>
                    </div>
                    <div className='flex items-start justify-between gap-2 px-4 py-3 text-sm'>
                        <p className='flex-1 min-w-0 break-all whitespace-normal leading-snug'>
                            Bio: {userDetails?.bio}
                        </p>
                    </div>
                </div>
            </div>
        ) : (
            <div className='h-full flex text-center items-center justify-center text-black bg-green-300 rounded-lg'>
                Click on friend name to view details
            </div>
        )
    )
}

export default UserDetails