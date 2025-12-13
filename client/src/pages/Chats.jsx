import React, { useState } from 'react'
import Friends from '../components/Friends'
import Chat from '../components/Chat'
import UserDetails from '../components/UserDetails'
import Navbar from './Navbar'

const Chats = () => {
    const [selectedUser, setSelectedUser] = useState(false)

    return (
        <div>
            <Navbar />
        </div>
    )
}

export default Chats