import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CircleUserRound, Loader, Type } from 'lucide-react'

import { AppContext } from '../context/AppContext'
import Navbar from '../components/Navbar'

const MyProfile = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, getUserData, authLoading, userData} = useContext(AppContext)
    const [newName, setNewName] = useState('')
    const [newBio, setNewBio] = useState('')
    const [newNameCheck, setNewNameCheck] = useState('')
    const [newBioCheck, setNewBioCheck] = useState('')

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

    useEffect(() => {
        if (userData) {
            setNewName(userData.name || '')
            setNewBio(userData.bio || '')
            setNewNameCheck(userData.name || '')
            setNewBioCheck(userData.bio || '')
        }
    }, [userData])

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (newName === newNameCheck && newBio === newBioCheck) {
                toast.error('Your details are same as before')
                return
            }
            else {
                const {data} = await axios.patch(`${backendUrl}/api/user/edit-profile`, {name: newName, bio: newBio})
                if (data.success) {
                    toast.success(data.message)
                    setNewName('')
                    setNewBio('')
                    setNewNameCheck('')
                    setNewBioCheck('')
                    await getUserData()
                }
                else {
                    toast.error(data.message)
                }
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

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
                <div className='flex flex-col min-h-screen items-center justify-center'>
                    <div className='flex flex-col items-center justify-center bg-black text-white w-[70%] sm:w-96 rounded-lg p-5 mt-20'>
                        <h1 className='text-3xl text-center font-semibold mb-5'>
                            My Profile
                        </h1>

                        <form onSubmit={onSubmitHandler} className='w-full'>
                            <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-lg bg-white text-black border focus-within:border-green-400'>
                                <CircleUserRound />
                                <input type='text' placeholder='Enter your name' value={newName} onChange={(e) => setNewName(e.target.value)} className='bg-transparent outline-none text-black w-full' required />
                            </div>

                            <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-lg bg-white text-black border focus-within:border-green-400'>
                                <Type />
                                <input type='text' placeholder='Enter your bio' value={newBio ?? ''} onChange={(e) => setNewBio(e.target.value)} className='bg-transparent outline-none text-black w-full' />
                            </div>

                            <button className='w-full px-5 py-2.5 rounded-lg bg-green-400 text-black cursor-pointer font-medium transition-all hover:scale-105 active:scale-95'>
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    )
}

export default MyProfile