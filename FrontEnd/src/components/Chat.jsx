import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/UserContext'
import axios from 'axios'
import Logo from './Logo'
import Contract from './Contract'
// import { connect } from 'mongoose'

const Chat = () => {
  const [ws , setWs] = useState(null)
  const [onlinePeople, setOnlinePeople] = useState({})
  const [offlinePeople, setOfflinePeople] = useState({})
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [message , setMessage] = useState([])
  const {username , id , setUsername , setId} = useContext(UserContext)
  const [newMessageText , setNewMessageText] = useState()

  //this useEffect for connectWebSocket
  useEffect(() => {
    connectToWs();
  }, [selectedUserId])
  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:4000")
    setWs(ws);
    ws.addEventListener('message', handleMessage) //in this line if someone want to message it will be handleMessage in line 28
    ws.addEventListener('close', () => {
      console.log("Disconnect. Trying to reconnect");
      connectToWs()
    }, 1000)
  }
  //this function for message
const handleMessage = (e) => {
  const messageData = JSON.parse(e.data)
  if('online' in messageData){ //this line
    showOnlinePeople(messageData.online)
  }else if('text' in messageData){
    if(messageData.sender === selectedUserId){
      setMessage((prev) => [...prev , {...messageData}])
    }
  }
}
const showOnlinePeople = (peopleArray) => {
  const people = {};
  peopleArray.forEach(({userId , username})=>{
    people[userId] = username
  })
  setOnlinePeople(people)
  
}

  useEffect(() => {
    axios.get("/people").then(res => {
      const offlinePeopleArr = res.data
      .filter((p) => p._id != id)
      .filter((p) => !Object.keys(onlinePeople).includes(p._id)
      );
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) =>{
        offlinePeople[p._id] = p
      });
      console.log("offline people");
      setOfflinePeople(offlinePeople);      
    })
  }
    , [onlinePeople])

    const onlinePeopleExclOurUser = {...onlinePeople};
    delete onlinePeopleExclOurUser[id]

  const Logout = () => {
    axios.post("/logout").then(()=> {
      setWs(null)
      setId(null)
      setUsername(null)
    })
  }
  const sendMessage = (e, file=null)=> {
    if(e) e.preventDefault();
    ws.send(JSON.stringify({
      recipient:selectedUserId,
      text:newMessageText,
      file,
    })
    );
    if (file) {
      axios.get("/message/" + selectedUserId).then(res => {
        setMessage(res.data)
      })
    }else {
      setNewMessageText("")
      setMessage(prev => [...prev , {
        text:newMessageText,
        send:id,
        recipient:selectedUserId,
        _id : Date.now()
      }])
    }
  }

  return (

    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          {Object.keys(onlinePeople).map((userId) => (
               <Contract
               key={userId}
               username={onlinePeople[userId]}
               id={userId}
               online={true}
               selected={userId === selectedUserId}
               onClick = {()=> setSelectedUserId(userId)}
             />
          ))}
         {Object.keys(offlinePeople).map((userId) => (
               <Contract
               key={userId}
               username={offlinePeople[userId].username}
               id={userId}
               online={false}
               selected={userId === selectedUserId}
               onClick = {()=> setSelectedUserId(userId)}
             />
          ))}
         
        </div>
        <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2-text-sm text-gray-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 
              8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 
              0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>

           { username}
          </span>
          <button className="text-sm blue-100 py-1 px-2 text-gray-500 border rounded-sm" onClick={Logout}>
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          <div className="flex h-full flex-grow items-center justify-center">
            <div className="text-gray-400">
              &larr; Go Chat!!
            </div>
          </div>
        </div>
        <form className="flex gap-2" onSubmit={sendMessage}>
          <input type="text" placeholder='Enter Chat'
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
            className="bg-white flex-grow border rounded-sm p-2"

          />
          <label htmlFor="" className="bg-blue-200 p-2
           text-gray-600 cursor-pointer rounded-sm border-blue-200">
            <input type="file" className="hidden" />
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </label>
          <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>

          </button>
        </form>
      </div>
    </div>

  )
}

export default Chat