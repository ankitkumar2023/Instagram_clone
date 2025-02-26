import React from 'react'
import Avatar from './ui/Avatar'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetAllMessages from '../hooks/useGetAllMessages'

const Messages = ({ selectedUser }) => {
    useGetAllMessages()
    const {messages} = useSelector(store=>store.chat)
    
  return (
    <div>
          <div className='flex justify-center'>
              <div className='flex flex-col items-center justify-center'>
                  <Avatar src={selectedUser?.profilePicture} name={selectedUser?.username} />
                  <span>{selectedUser?.username}</span>
                  <Link to={`/profile/${selectedUser?._id}`}><button className='text-sm p-2 bg-blue-400 text-white rounded-md cursor-pointer'>View Profile</button></Link>
              </div>
              
          </div>
          <div className='flec flex-col gap-2'>
              {messages && (
                  messages.map((msg) => {
                    return (
                        <div className={`flex`}>
                            <div>{ msg}</div>
                        </div>
                    )
                })
              )
                  
              }
              
          </div>
    </div>
  )
}

export default Messages
