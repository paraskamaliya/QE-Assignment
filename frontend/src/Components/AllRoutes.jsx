import { Route, Routes } from "react-router-dom"
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import AddBook from "../Pages/AddBook";

const AllRoutes = () => {
    return <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/books" element={<Home />} />
        <Route path="/add" element={<AddBook />} />
    </Routes>
}
export default AllRoutes;