import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
const Home = () => {
    const URL = "https://lms-gr4j.onrender.com/";
    const auth = useSelector(store => store);
    console.log(auth);

    const [data, setData] = useState([]);
    const fetchTheData = async () => {
        try {
            let res = fetch(`${URL}/books/all`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.token.split('"')[0]}`
                }
            })
            let data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchTheData();
    }, [])
    return <Box>

    </Box>
}
export default Home;