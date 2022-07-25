import React, { Children, useContext, useEffect, useState } from "react"
import { getValueByKey } from "../services/Token";
import { AuthContext } from "./Auth";
import api from "../services/Api"

const ChannelContext = React.createContext();

function ChannelProvider({ children }) {
    const { accessToken } = useContext(AuthContext)
    const [hasChannel, setHasChannel] = useState(false);

    const getChannel = async () => {
        try {
            const userId = getValueByKey("userId", accessToken)
            await api.get(`${process.env.REACT_APP_API_URL}/channels/${userId}`)
            setHasChannel(true)
        } catch (error) {
            setHasChannel(false)
        }
    }

    useEffect(() => {
        if (accessToken != null)
            getChannel()
    }, [accessToken])

    return (
        <ChannelContext.Provider value={{ hasChannel, setHasChannel }}>
            {children}
        </ChannelContext.Provider>
    )
}

export { ChannelContext, ChannelProvider }