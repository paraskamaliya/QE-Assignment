import { Box, Heading, Link as ChakraLink, Avatar, Menu, MenuButton, MenuList, MenuItem, AlertDialog, Button, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast, AlertDialogOverlay, useDisclosure } from "@chakra-ui/react"
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { LOGOUT } from "../Redux/actionType";

const Navbar = () => {
    const URL = "https://lms-gr4j.onrender.com/";
    const auth = useSelector(store => store);
    const dispatch = useDispatch();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleLogout = async () => {
        try {
            let res = await fetch(`${URL}users/logout`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.token.split('"')[0]}`,
                    "content-type": "application/json"
                }
            })
            if (res.status === 200) {
                dispatch({ type: LOGOUT })
                toast({
                    title: "Logout Successfully",
                    description: "You are Logged out Successfully",
                    duration: 3000,
                    isClosable: false,
                    status: "success"
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    return <Box>
        <Box display={"flex"} height={"10vh"} border={"1px solid black"} alignItems={"center"} bg={"purple"} color={"white"} justifyContent={"space-between"} padding={"0% 2%"}>
            <Box>
                <ChakraLink as={Link} to="/" _hover={{ textDecoration: "none" }} fontSize={"larger"}>
                    <Heading>LMS</Heading>
                </ChakraLink>
            </Box>
            <Box>
                {auth.isAuth == false ?
                    <ChakraLink as={Link} to="/books" _hover={{ textDecoration: "none" }} fontSize={"larger"}>
                        Books
                    </ChakraLink>
                    : <Menu>
                        <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} rightIcon={<ChevronDownIcon fontSize={"2xl"} color={"white"} />}>
                            <Avatar src={`https://bit.ly/`} name={auth.user.username} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem textAlign={"center"} borderBottom={"1px solid black"}>
                                <Link to={"/books"} style={{ width: "100%", fontWeight: 500, fontSize: "larger", color: "black" }}>Books</Link>
                            </MenuItem>
                            {auth.user.roles.includes("CREATOR") && <MenuItem textAlign={"center"} borderBottom={"1px solid black"}>
                                <Link to={"/add"} style={{ width: "100%", fontWeight: 500, fontSize: "larger", color: "black" }}>Add Book</Link>
                            </MenuItem>}
                            <MenuItem textAlign={"center"}>
                                <Button style={{ margin: "auto", width: "100%", fontWeight: 500, fontSize: "larger", background: "red", color: "white" }} onClick={onOpen}>Logout</Button>
                                <AlertDialog
                                    isOpen={isOpen}
                                    onClose={onClose}
                                    isCentered
                                >
                                    <AlertDialogOverlay>
                                        <AlertDialogContent w={["80%", "80%", "100%", "100%", "100%"]}>
                                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                                Logout
                                            </AlertDialogHeader>

                                            <AlertDialogBody>
                                                Are you sure? You want to Logout.
                                            </AlertDialogBody>

                                            <AlertDialogFooter>
                                                <Button onClick={onClose}>
                                                    Cancel
                                                </Button>
                                                <Button colorScheme='red' onClick={() => {
                                                    onClose();
                                                    handleLogout();
                                                }} ml={3}>
                                                    Logout
                                                </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialogOverlay>
                                </AlertDialog>
                            </MenuItem>
                        </MenuList>
                    </Menu>}
            </Box>
        </Box>
    </Box>
}
export default Navbar;