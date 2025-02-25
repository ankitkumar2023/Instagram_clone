import React from 'react'
import SinglePost from './SinglePost'
import { useSelector } from 'react-redux'

const Posts = () => {
  const { posts } = useSelector(store => store.post)
  console.log("post details in posts page", posts);


  return (
    <div className='flex flex-col  gap-2'>
      {posts.map((post) => <SinglePost key={post._id} post={post} />)}
    </div>
  )
}

export default Posts
