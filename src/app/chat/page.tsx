"use client";
import React from 'react'
import { useState,useEffect } from 'react';
type Message={
    id:number;
    text:string;
}
const page = () => {
    const [chat,setChat]=useState<string>("")
    const [chats,setChats]=useState<Message[]>([])
    const handleClick=()=>{
        if(!chat.trim()) return;
        setChats(prev=>[
            ...prev,
            {id:Date.now(),text:chat}
        ])
        setChat("");
    }
    useEffect(() => {
//   localStorage.setItem()
}, [chats]);

  return (
    <div>
      <h1 className='text-center font-bold text-2xl'>Chat app</h1>

        <div className='flex w-[80%]  justify-center items-center m-3 mx-auto'>
            <input type="text" className='bg-gray-600 text-white w-[50%]' value={chat} onChange={e=>setChat(e.target.value)} placeholder='Enter message'/>
            <button className='bg-white text-black' onClick={handleClick}>Send</button>
        </div>
        <div>
            {chats.map((chat)=>(
                <ul key={chat.id}>
                    <li>{chat.text}</li>
                </ul>
            ))}
        </div>
    </div>
  )
}

export default page
