
export const isAuthenticated = () => {
    const accessToken = localStorage.getItem("accessToken");
    return accessToken != null
}
