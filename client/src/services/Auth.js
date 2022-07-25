import axios from "axios"

export const isAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken != null
}


export const authenticate = async (code ) => {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/users/oauthcallback`, { code });
    return data;
}