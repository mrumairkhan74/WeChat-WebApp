import React from 'react'

const LogoL = () => {
  return (
    <div className=' w-full h-screen bg-transparent relative'>
    <div className="w-[500px] h-[500px] rounded-md bg-transparent backdrop-blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md ">
       <img src="./images/login-lock.png" className='items-center justify-center p-2 w-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin' />
    </div>
</div>
  )
}

export default LogoL