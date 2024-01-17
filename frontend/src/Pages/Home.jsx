import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, FormLabel, Heading, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Textarea, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import LoadingIndicator from "../Components/LoadingIndicator";
import ErrorIndicator from "../Components/ErrorIndicator";
const Home = () => {
    const URL = "https://lms-gr4j.onrender.com/";
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const auth = useSelector(store => store);

    const [load, setLoad] = useState(false);
    const [err, setErr] = useState(false);
    const [data, setData] = useState([]);
    const [order, setOrder] = useState("");

    const [editItem, setEditItem] = useState({});

    const fetchTheData = async () => {
        setLoad(true);
        let url = `${URL}books/`
        if (order !== "") {
            url += `?${order}=1`
        }
        try {
            let res = await fetch(`${url}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.token.split('"')[0]}`
                }
            })
            if (res.status !== 200) {
                toast({
                    title: "Something went wrong.",
                    description: "Something went wrong, Please try again.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                })
            }
            let data = await res.json();
            setData(data);
            setLoad(false);
        } catch (error) {
            setLoad(false);
            setErr(true);
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
            else if (res.status === 201) {
                toast({
                    title: "You are not authorized",
                    description: "You are not authorized, Please login.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                })
            }
            else if (res.status === 400) {
                toast({
                    title: "You are not authorized",
                    description: "You are not authorized, Please login.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                })
            }
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Something went wrong, Please try again",
                duration: 3000,
                isClosable: true,
                status: "error"
            });
        }
    };

    const handleDeleteClick = async () => {
        try {
            let res = await fetch(`${URL}books/delete/${editItem._id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${auth.token.split('"')[0]}`,
                    "content-type": "application/json"
                }
            })
            if (res.status === 200) {
                let updated = data.filter((el) => (el._id !== editItem._id));
                setData(updated);
                toast({
                    title: "Book data is Deleted",
                    description: "Book data is deleted",
                    duration: 3000,
                    isClosable: true,
                    status: "success"
                });
            }
            else if (res.status === 201) {
                toast({
                    title: "You are not authorized",
                    description: "You are not authorized, Please login.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                })
            }
            else if (res.status === 400) {
                toast({
                    title: "You are not authorized",
                    description: "You are not authorized, Please login.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                })
            }
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Something went wrong, Please try again",
                duration: 3000,
                isClosable: true,
                status: "error"
            });
        }
    };
    useEffect(() => {
        fetchTheData();
    }, [order])


    if (load) {
        return <LoadingIndicator />
    }
    if (err) {
        return <ErrorIndicator />
    }
    return <Box bg={"#ffc1fb"} color={"black"}>
        <Box textAlign={"center"} p={2}>
            <Heading>Book List</Heading>
            {auth.user.roles.includes("CREATOR") && <Box display={"flex"} w={"50%"} m={"auto"} gap={"5%"} justifyContent={"center"} flexDirection={["column", "column", "row", "row", "row"]}>
                <Button colorScheme="green" onClick={() => setOrder("old")} m={"auto"} mb={1} w={"fit-content"}>Filter 10 min ago</Button>
                <Button colorScheme="red" onClick={() => setOrder("new")} m={"auto"} mb={1} w={"fit-content"}>Filter in 10 min</Button>
                <Button colorScheme="red" onClick={() => setOrder("")} m={"auto"} mb={1} w={"fit-content"}>Reset</Button>
            </Box>}
        </Box>
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
                                {auth.user.roles.includes("CREATOR") && <Td textAlign={"center"}><IconButton icon={<DeleteIcon />} bg={"red.500"} onClick={() => {
                                    setEditItem(el);
                                    onAlertOpen();
                                }} color={"white"} _hover={{ bgColor: "none" }} /></Td>}
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
        <AlertDialog
            isOpen={isAlertOpen}
            onClose={onAlertClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent w={["80%", "80%", "100%", "100%", "100%"]}>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete Book
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You want to delete Book.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onAlertClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={() => {
                            onAlertClose();
                            handleDeleteClick();
                        }} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    </Box>
}
export default Home;