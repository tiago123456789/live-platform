import { Route, useNavigate } from "react-router-dom/"
import Login from "../../pages/Login";
import { isAuthenticated } from "../../services/Auth";

export default ({ component: Component }) => {
    if (!isAuthenticated()) {
        return <Login />
    }
     
    return <Component />
}