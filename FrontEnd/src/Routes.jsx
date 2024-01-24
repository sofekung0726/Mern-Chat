import React, { useContext } from "react";
import Chat from "./components/Chat";
import RegisterAndLoginForm from "./components/RegisterAndLoginForm";
import { UserContext } from "./context/UserContext";
const Routes = () => {
    const {username} = useContext(UserContext)
    if(username){
        return<Chat />;
    }
  return (
    <RegisterAndLoginForm />
  )
}

export default Routes