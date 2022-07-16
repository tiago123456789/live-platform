
export const get = () => {
    return localStorage.getItem("accessToken")
}

export const getValueByKey = (key, token) => {
    let payload = token.split(".")[1]
    payload = atob(payload);
    payload = JSON.parse(payload);
    return payload[key] || null;
}