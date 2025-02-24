import React from 'react'
import Avatar from './ui/Avatar'

const RightSideBar = () => {

  return (
    <div className='w-[18%] h-screen border-1' >
          <div className='flex flex-col justify-center my-5'>
              <div className='flex items-center gap-2 ml-2'>
                  <Avatar name="A N" />
                  <span>Username</span>
              </div>
              
              <h1 className='text-center '>Suggested Account</h1>
              <div className='flex flex-col gap-3 justify-center items-center mt-5'>
                  {[1, 2, 3, 4].map((item,index) => (<div key={index}>{item}</div>))}
                </div>
        </div>
    </div>
  )
}

export default RightSideBar
