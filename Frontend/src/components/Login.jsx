import React, { useState } from 'react'
import Label from './ui/Label'
import Input from './ui/Input'
import Button from './ui/Button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/slice/authSlice'




const Login = () => {
 
    const [input, setInput] = useState({
        email:"",
        password:""
    })

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [loading,setLoading] = useState(false)

    const changeEventHandler = (e) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleLoginSubmit = async(e) => {
        e.preventDefault();
        console.log("input checker inside login component", input);
        try {
            setLoading(true);
            const response = await axios.post(
              "https://instagram-backend-k7w6.onrender.com/api/v1/user/login",
              input,
              {
                header: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            console.log("response from the backend while loggin",response)

            if (response.data.success) {
                dispatch(setAuthUser(response.data.user))
                navigate('/')
                toast.success(response.data.message);
                setInput({
                    email: "",
                    password:""
                })
            }
        } catch (error) {
            console.log("error while loggin in frontend", error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }
    
  return (
      <div className='flex item-center w-screen h-[80%] mt-30 justify-center'>
          <form onSubmit={handleLoginSubmit} className='shadow-lg flex flex-col gap-5 p-8'>
              <div className="my-4">
                  <h1 className='text-center font-bold text-xl'>LOGO</h1>
                  <p className='text-sm text-center'>Login to see photos & videos from your friend</p>
              </div>
              <div>
                  <span className='my-12 text-[15px] font-bold'>Email</span>
                  <Input
                      type="email"
                      name="email"
                      value={input.email}
                      onChange={changeEventHandler}
                      placeholder="Enter your email"
                      className="focus-visible:ring-transparent"
                      autoComplete="email"

                  />

              </div>
              <div>
                  <span className='my-12 text-[15px] font-bold'>Password</span>
                  <Input
                      type="password"
                      name="password"
                      value={input.password}
                      onChange={changeEventHandler}
                      placeholder="Enter your Password"
                      className="focus-visible:ring-transparent"
                      autoComplete="current-password"

                  />

              </div>
              {
                  loading ? (
                      <button>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          please wait
                  </button>
                  ) : (
                    <button type='submit' className='mt-10 w-[95%] h-[45px] m-auto text-center flex justify-center items-center bg-[#2A3335] text-white rounded-md '>Login</button>
                  )
              }
              
              <span className='text-center'>Does't have an account ? <Link to='/signup' className='text-blue-400'> Create an Account</Link></span>
          </form>
      
    </div>
  )
}

export default Login
