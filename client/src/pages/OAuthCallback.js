import { useContext, useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom/"
import { AuthContext } from "../providers/Auth"
import { toast } from 'react-toastify';
import { authenticate } from "../services/Auth";

export default () => {
  const { storeAccessToken } = useContext(AuthContext)

  const navigate = useNavigate();

  const getUsernameAndImage = async (code) => {
    const data = await authenticate(code)
    toast("Login with success.", {
      type: "success"
    })
    localStorage.setItem("username", data.username)
    storeAccessToken(data.accessToken)
    navigate("/lives")
  }

  useEffect(() => {
    const querystring = new URLSearchParams(window.location.search);
    getUsernameAndImage(querystring.get("code"))
  }, [])

  return (
    <h1>
      Authenticating...
    </h1>
  )
}