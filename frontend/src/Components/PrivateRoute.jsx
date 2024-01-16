import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
const PrivateRoute = ({ children }) => {
    const auth = useSelector(store => store);
    return auth.isAuth ? children : <Navigate to={"/"} />
}
export default PrivateRoute;