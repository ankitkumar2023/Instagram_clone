import React, { useState } from 'react'
import Label from './ui/Label'
import Input from './ui/Input'
import Button from './ui/Button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'




const Signup = () => {
 
    const [input, setInput] = useState({
        username:"",
        email:"",
        password:""
    })

    const navigate = useNavigate()

    const [loading,setLoading] = useState(false)

    const changeEventHandler = (e) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleSignupSubmit = async(e) => {
        e.preventDefault();
        console.log("input checker", input);
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                header: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.data.success) {
                navigate('/login')
                toast.success(response.data.message);
                setInput({
                    username: "",
                    email: "",
                    password:""
                })
            }
        } catch (error) {
            console.log("error while signing up in frontend", error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }
    
  return (
      <div className='flex item-center w-screen h-[80%] mt-30 justify-center'>
          <form onSubmit={handleSignupSubmit} className='shadow-lg flex flex-col gap-5 p-8'>
              <div className="my-4">
                  <h1 className='text-center font-bold text-xl'>LOGO</h1>
                  <p className='text-sm text-center'>Signup to see photos & videos from your friend</p>
              </div>
              <div>
                  <span className='my-12 text-[15px] font-bold'>Username</span>
                  <Input
                      type="text"
                      name="username"
                      value={input.username}
                      onChange={changeEventHandler}
                      placeholder="Enter your user name"
                      className="focus-visible:ring-transparent "
                      autoComplete="username"

                  />

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
                          <Loader2 className='mr-2 w-4 h-4 animate-spin'/>
                          please Wait
                  </button>
                  ) : (
                    <button type='submit'
                    className='mt-10 w-[95%] h-[45px] m-auto text-center flex justify-center items-center bg-[#2A3335] text-white rounded-md '
                >Signup
                </button> 
                  )
              }
              
              <span className='text-center'>Already have an account ? <Link to='/login' className='text-blue-400'> Login</Link></span>
              
          </form>
      
    </div>
  )
}

export default Signup
