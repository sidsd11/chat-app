import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader, User, Mail, Lock } from 'lucide-react'

import { AppContext } from '../context/AppContext'
import Navbar from './Navbar'

const Login = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, setIsLoggedIn, getUserData, loading} = useContext(AppContext)

    const [state, setState] = useState(() => {
        return localStorage.getItem('authMode-state') || 'Login'
    })
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            const {data} = await axios.post(`${backendUrl}/api/user/${state.toLowerCase()}`, {name, email, password})
            if (data.success) {
                toast.success(data.message)
                setIsLoggedIn(true)
                getUserData()
                navigate('/')
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const init = async () => {
            try {
                if (isLoggedIn) {
                    navigate('/chats')
                }
            }
            catch (error) {
                toast.error(error.message)
            }
        }
        init()
    })

    useEffect(() => {
        localStorage.setItem('authMode-state', state)
    }, [state])

    return (
        loading
        ? (
            <div className='flex flex-col min-h-screen justify-center items-center'>
                <h1 className='text-3xl text-center font-semibold mb-5'>
                    Loading your page
                </h1>
                <Loader className='animate-spin'/>
            </div>
        ) : (
            <>
                <Navbar />
                <div className='flex flex-col min-h-screen items-center justify-center'>
                    <div className='flex flex-col items-center justify-center bg-black text-white w-[70%] sm:w-96 rounded-lg p-5 mt-20'>
                        <h1 className='text-3xl text-center font-semibold mb-5'>
                            {state}
                        </h1>

                        <form onSubmit={onSubmitHandler} className='w-full'>
                            {
                                state === 'Register' && (
                                    <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-lg bg-white text-black border focus-within:border-green-400'>
                                        <User />
                                        <input type='text' placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} className='bg-transparent outline-none text-black w-full' required />
                                    </div>
                                )
                            }

                            <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-lg bg-white text-black border focus-within:border-green-400'>
                                <Mail />
                                <input type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} className='bg-transparent outline-none text-black w-full' required />
                            </div>

                            <div className='flex items-center mb-4 gap-3 w-full px-5 py-2.5 rounded-lg bg-white text-black border focus-within:border-green-400'>
                                <Lock />
                                <input type='password' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent outline-none text-black w-full' required />
                            </div>

                            <button className='w-full px-5 py-2.5 rounded-lg bg-green-400 text-black cursor-pointer font-medium transition-all hover:scale-105 active:scale-95'>
                                {state}
                            </button>

                            {
                                state === 'Login' && (
                                    <p onClick={() => navigate('/reset-password')} className='px-2.5 py-2.5 text-center'>
                                        <span className='cursor-pointer underline transition-all hover:scale-105 active:scale-95'>Forgot Password?</span>
                                    </p>
                                )
                            }

                            {
                                state === 'Login'
                                ? (
                                    <p className='py-2.5 px-2.5 text-center'>
                                        Don't have an account? <span onClick={() => setState('Register')} className='inline-block cursor-pointer underline transition-all hover:scale-105 active:scale-95'>Register here</span>
                                    </p>
                                ) : (
                                    <p className='py-2.5 px-2.5 text-center'>
                                        Already have an account? <span onClick={() => setState('Login')} className='inline-block cursor-pointer underline transition-all hover:scale-105 active:scale-95'>Login here</span>
                                    </p>
                                )
                            }
                        </form>
                    </div>
                </div>
            </>
        )
    )
}

export default Login