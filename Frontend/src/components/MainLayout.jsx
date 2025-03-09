import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSideBar from './LeftSideBar'
import RightSideBar from './RightSideBar'

const MainLayout = () => {
  return (
    <div>
      <LeftSideBar/>
      <Outlet>
        
      </Outlet>
        
              
          
    </div>
  )
}

export default MainLayout
