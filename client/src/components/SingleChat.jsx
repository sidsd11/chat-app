import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, CircleX, SendHorizontal } from 'lucide-react'

import { AppContext } from '../context/AppContext'

const SingleChat = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, authLoading, isFriendSelected, setIsFriendSelected, setIsFriendProfileSelected, selectedFriendId, setSelectedFriendId, userData, width} = useContext(AppContext)
    const [chats, setChats] = useState([])
    const [friendName, setFriendName] = useState('')
    const [messageToSend, setMessageToSend] = useState('')
    const [imageToSend, setImageToSend] = useState('')
    const chatContainerRef = useRef(null)

    const getChats = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/message/get-all-messages/${selectedFriendId}`)
            if (data.success) {
                setChats(data.messages)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const getFriendName = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/get-single-user-data/${selectedFriendId}`)
            if (data.success) {
                setFriendName(data.userData.name)
            }
            else {
                toast.error(data.message)
                setFriendName('')
            }
        }
        catch (error) {
            toast.error(error.message)
            setFriendName('')
        }
    }

    const sendMessage = async (e) => {
        try {
            e.preventDefault()
            const {data} = await axios.post(`${backendUrl}/api/message/send-message/${selectedFriendId}`, {text: messageToSend, image: imageToSend})
            if (data.success) {
                setMessageToSend('')
                setImageToSend('')
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
            setMessageToSend('')
            setImageToSend('')
        }
    }


    useEffect(() => {
        if (authLoading) return

        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        if (!isFriendSelected || !selectedFriendId) return

        getChats()
        getFriendName()
    }, [isLoggedIn, authLoading, selectedFriendId, messageToSend, imageToSend])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [chats])

    return (
        isFriendSelected
        ? (
            <div className='h-full flex flex-col rounded-lg text-black bg-green-300 overflow-hidden'>
                <div className='h-[10%] bg-green-500 flex items-center px-4 text-sm font-semibold rounded-t-lg cursor-pointer'>
                    {
                        width < 1024 && (
                            <ArrowLeft
                            className='size-5 mr-5 cursor-pointer transition-all hover:scale-105 active:scale-95'
                            onClick={() => {
                                setIsFriendSelected(false)
                                setIsFriendProfileSelected(false)
                                setSelectedFriendId('')
                            }} />
                        )
                    }
                    <p onClick={() => setIsFriendProfileSelected(true)} className='w-full hover:scale-101 active:scale-95 transition-all'>
                        {friendName}
                    </p>
                    {
                        width >= 1024 && (
                            <CircleX
                            className='size-4 mr-5 cursor-pointer transition-all hover:scale-105 active:scale-95 z-10'
                            onClick={() => {
                                setIsFriendSelected(false)
                                setIsFriendProfileSelected(false)
                                setSelectedFriendId('')
                            }} />
                        )
                    }
                </div>

                <div ref={chatContainerRef} className='h-[80%] overflow-y-auto p-3 space-y-2'>
                    {
                        chats.length > 0
                        ? (
                            chats.map(chat => {
                                const isOwnMessage = chat.senderId === userData.id
                                return (
                                    <div
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    key={chat._id}>
                                        <div
                                        className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${isOwnMessage ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-black rounded-bl-none'} wrap-break-word whitespace-pre-wrap`}>
                                            {chat.text}
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className='h-[80%] flex items-center justify-center text-black'>
                                No chats to display
                            </div>
                        )
                    }
                </div>

                <div className='h-[10%] px-3 bg-green-200 rounded-b-lg'>
                    <form onSubmit={sendMessage} className='flex items-center gap-2 h-full'>
                        <input
                        type='text' placeholder='Send a message...' value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)}
                        className='flex-1 h-full px-3 text-sm rounded-lg outline-none'
                        required />
                        <button className='p-1'>
                            <SendHorizontal className='size-4 cursor-pointer'/>
                        </button>
                    </form>
                </div>
            </div>
        )  : (
            <div className='h-full flex items-center justify-center text-black bg-green-300 rounded-lg'>
                Select a friend to start chatting
            </div>
        )
    )
}

export default SingleChat