import api from "./Api"

export const getOnlineChannels = async () => {
    const { data } = await api.get('http://localhost:3001/online-channels')
    return data
}

export const startChannelStream = (id) => {
    return api.post(`http://localhost:3001/online-channels/${id}`)
}

export const finishChannelStream = (id) => {
    return api.delete(`http://localhost:3001/online-channels/${id}`)
}

export const createChannel = (data) => {
    return api.post(`http://localhost:3001/channels`, data)
}