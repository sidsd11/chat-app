import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'

import { AppContext } from '../context/AppContext'
import socket from '../connection/socket'

const Friends = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, authLoading, setIsFriendSelected, setSelectedFriendId, setIsFriendProfileSelected, selectedFriendId} = useContext(AppContext)
    const [allUsers, setAllUsers] = useState([])
    const [search, setSearch] = useState('')
    const filteredUsers = allUsers.filter(user => (
        user.name.toLowerCase().includes(search.toLowerCase())
    ))
    const [unseenMessages, setUnseenMessages] = useState({})

    const getAllUsers = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/message/get-all-users`)
            if (data.success) {
                setAllUsers(data.allUsersList)
                setUnseenMessages(data.unseenMessages || {})
            }
        }
        catch (error) {
            toast.error(error.message)
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

        getAllUsers()
    }, [isLoggedIn, authLoading])

    useEffect(() => {
        const handleNewMessage = ({ senderId }) => {
            setUnseenMessages(prev => ({ ...prev, [senderId]: prev[senderId] ? prev[senderId] + 1 : 1 }))
        }
        socket.on('new_unseen_message', handleNewMessage)
        socket.on('message_marked_as_seen', getAllUsers)
        socket.on('receive_message', getAllUsers)
        socket.on('refresh_chats', getAllUsers)

        return () => {
            socket.off('message_marked_as_seen', handleNewMessage)
            socket.off('receive_message', getAllUsers)
            socket.off('refresh_chats', getAllUsers)
            socket.off('new_unseen_message', getAllUsers)
        }
    }, [])

    return (
        <div className='h-full flex flex-col rounded-lg bg-green-300 text-black overflow-hidden'>
            <div className='relative h-[10%] bg-green-500 flex items-center px-4 text-sm rounded-t-lg'>
                    <Search className='absolute left-5 top-1/2 -translate-y-1/2 size-4 text-gray-500' />
                    <input type='text' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}
                    className='w-full pl-8 pr-2 py-1.5 text-sm rounded-md outline-none' />
            </div>

            <div className='h-[90%] overflow-y-auto w-full'>
                {
                    filteredUsers.map(user => {
                        const count = unseenMessages[user._id]
                        const isSelected = selectedFriendId === user._id
                        return (
                            <div
                            key={user._id}
                            className={`flex items-start justify-between gap-2 px-4 py-3 mb-1 text-sm transition-colors ${isSelected ? 'bg-green-400' : 'hover:bg-green-400 cursor-pointer'}`}
                            onClick={() => {
                                if (!isSelected) {
                                setIsFriendSelected(true)
                                setIsFriendProfileSelected(false)
                                setSelectedFriendId(user._id)
                                setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                                }
                            }}>
                                <span className={`flex-1 min-w-0 break-all whitespace-normal leading-snug ${!isSelected && 'hover:scale-105 active:scale-95 transition-all'}`}>
                                    {user.name}
                                </span>
                                {
                                    count > 0 && (
                                        <span className='min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold shrink-0'>
                                            {count}
                                        </span>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Friends