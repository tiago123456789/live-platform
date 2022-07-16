import { useEffect } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom/"

export default () => {
    const navigate = useNavigate();
  
    const getUsernameAndImage = async (code) => {
      const { data } = await axios.post('http://localhost:3001/users/oauthcallback', { code });
      localStorage.setItem("username", data.username)
      localStorage.setItem("accessToken", data.accessToken);
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