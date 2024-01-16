import { Route, Routes } from "react-router-dom"
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import AddBook from "../Pages/AddBook";
import PrivateRoute from "./PrivateRoute";
const AllRoutes = () => {
    return <Routes>
        <Route path="/" element={<Login />} />
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