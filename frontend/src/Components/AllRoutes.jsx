import { Route, Routes } from "react-router-dom"
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import AddBook from "../Pages/AddBook";
import PrivateRoute from "./PrivateRoute";
import Notfound from "./NotFound";
const AllRoutes = () => {
    return <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/books" element={
            <PrivateRoute>
                <Home />
            </PrivateRoute>
        } />
        <Route path="/add" element={
            <PrivateRoute>
                <AddBook />
            </PrivateRoute>
        } />
    </Routes>
}
export default AllRoutes;