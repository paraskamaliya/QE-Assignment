import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, FormLabel, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Textarea, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
const Home = () => {
    const URL = "https://lms-gr4j.onrender.com/";
    const toast = useToast();
    const auth = useSelector(store => store);
    const [data, setData] = useState([]);
    const [editItem, setEditItem] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure()

    const fetchTheData = async () => {
        try {
            let res = await fetch(`${URL}books/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.token.split('"')[0]}`
                }
            })
            let data = await res.json();
            setData(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (e) => {
        setEditItem({
            ...editItem,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateClick = async () => {
        try {
            let res = await fetch(`${URL}books/update/${editItem._id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${auth.token.split('"')[0]}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify(editItem)
            })
            if (res.status === 200) {
                let updated = data.map((el) => (el._id === editItem._id ? editItem : el));
                setData(updated);
                onClose();
                toast({
                    title: "Book data is Updated",
                    description: "Book data is updated",
                    duration: 3000,
                    isClosable: true,
                    status: "success"
                });
            }
        } catch (error) {

        }
    };
    useEffect(() => {
        fetchTheData();
    }, [])
    return <Box bg={"#ffc1fb"} color={"black"}>
        {data.length > 0 && <TableContainer m={"auto"}>
            <Table>
                <Thead>
                    <Tr>
                        <Th textAlign={"center"}>Cover Image</Th>
                        <Th textAlign={"center"}>Title</Th>
                        <Th textAlign={"center"}>Description</Th>
                        <Th textAlign={"center"}>Genre</Th>
                        <Th textAlign={"center"}>Author</Th>
                        <Th textAlign={"center"}>Date</Th>
                        {auth.user.roles.includes("CREATOR") && <Th textAlign={"center"}>
                            Edit
                        </Th>}
                        {auth.user.roles.includes("CREATOR") && <Th textAlign={"center"}>
                            Delete
                        </Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        data.length > 0 && data.map((el) => {
                            return <Tr key={el._id}>
                                <Td textAlign={"center"} m={"auto"}>
                                    <Image src={el.cover} alt="cover" w={"100px"} m={"auto"} />
                                </Td>
                                <Td textAlign={"center"}>{el.title}</Td>
                                <Td textAlign={"center"}>{el.description}</Td>
                                <Td textAlign={"center"}>{el.genre}</Td>
                                <Td textAlign={"center"}>{el.author}</Td>
                                <Td textAlign={"center"}>{el.date}</Td>
                                {auth.user.roles.includes("CREATOR") && <Td textAlign={"center"}><IconButton m={"auto"} icon={<EditIcon />} onClick={() => {
                                    setEditItem(el);
                                    onOpen();
                                }} bg={"yellow.500"} color={"white"} _hover={{ bgColor: "none" }} /></Td>}
                                {auth.user.roles.includes("CREATOR") && <Td textAlign={"center"}><IconButton icon={<DeleteIcon />} bg={"red.500"} color={"white"} _hover={{ bgColor: "none" }} /></Td>}
                            </Tr>
                        })
                    }
                </Tbody>
            </Table>
        </TableContainer>}
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {editItem && (
                        <>
                            <form>
                                <FormLabel>ID :- {editItem._id}</FormLabel>
                                <FormLabel>Cover :-
                                    <Input value={editItem.cover} name="cover" onChange={(e) => handleInputChange(e)} />
                                </FormLabel>
                                <FormLabel>Title :-
                                    <Input value={editItem.title} name="title" onChange={(e) => handleInputChange(e)} />
                                </FormLabel>
                                <FormLabel>Genre :-
                                    <Input value={editItem.genre} name="genre" onChange={(e) => handleInputChange(e)} />
                                </FormLabel>
                                <FormLabel>Description :-
                                    <Textarea value={editItem.description} name="description" onChange={(e) => handleInputChange(e)} />
                                </FormLabel>
                                <FormLabel>Author :-
                                    <Input value={editItem.author} name="author" onChange={(e) => handleInputChange(e)} />
                                </FormLabel>
                            </form>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button bg={"#426800"} color={"white"} onClick={handleUpdateClick}>Save Changes</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>
}
export default Home;