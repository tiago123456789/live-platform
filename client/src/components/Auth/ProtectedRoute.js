import { useContext } from "react";
import Login from "../../pages/Login";
import { AuthContext } from "../../providers/Auth";

export default ({ component: Component }) => {
    const { checkIfUserAuthenticated } = useContext(AuthContext);
    if (!checkIfUserAuthenticated()) {
        return <Login />
    }
     
    return <Component />
}