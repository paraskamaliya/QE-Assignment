import { Box, Button, Input, Select } from "@chakra-ui/react"
import { useState } from "react";
import { useSelector } from "react-redux";

const AddBook = () => {
    const URL = "https://lms-gr4j.onrender.com/";
    const auth = useSelector(store => store);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [cover, setCover] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");


    const handleSubmit = async () => {
        const payload = {
            title,
            description,
            cover,
            author,
            genre
        }
        try {
            let res = await fetch(`${URL}books/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${auth.token.split('"')[0]}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify(payload)
            })
            let data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    return <Box display={"flex"} height={"90vh"} alignItems={"center"} bg={"#ffc1fb"} color={"black"}>
        <Box w={"50%"} m={"auto"} alignItems={"center"} textAlign={"center"}>
            <Input placeholder="Enter Title of Book" value={title} onChange={(e) => setTitle(e.target.value)} m={1} borderColor={"black"} focusBorderColor="black" p={3} />
            <Input placeholder="Enter Description of Book" value={description} onChange={(e) => setDescription(e.target.value)} m={1} borderColor={"black"} focusBorderColor="black" p={3} />
            <Input placeholder="Enter Cover Image URL of Book" value={cover} onChange={(e) => setCover(e.target.value)} m={1} borderColor={"black"} focusBorderColor="black" p={3} />
            <Input placeholder="Enter Author name of Book" value={author} onChange={(e) => setAuthor(e.target.value)} m={1} borderColor={"black"} focusBorderColor="black" p={3} />
            <Select value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Select Genre of Book" m={1} borderColor={"black"} focusBorderColor="black" >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Poetry">Poetry</option>
                <option value="Drama/Play">Drama/Play</option>
                <option value="Mystery/Thriller">Mystery/Thriller</option>
                <option value="Science Fiction/Fantasy">Science Fiction/Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Historical">Historical</option>
            </Select>
            <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
        </Box>
    </Box>
}
export default AddBook;