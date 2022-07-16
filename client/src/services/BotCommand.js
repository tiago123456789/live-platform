import api from "./Api"


export const getAll = async (channelId) => {
    const { data } = await api.get(`http://localhost:3001/channels/${channelId}/bot-commands`)
    return data
}

export const create = async (channelId, command) => {
    const { data } = await api.post(
        `http://localhost:3001/channels/${channelId}/bot-commands`, 
        command
    )
    return data
}

export const remove = async (channelId, command) => {
    return api.delete(`http://localhost:3001/channels/${channelId}/bot-commands`, {
        
        data: {
            command
        }
    })
}