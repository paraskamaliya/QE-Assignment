import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LOGIN } from "../Redux/actionType";
import { Box, Button, Checkbox, FormControl, IconButton, Input, InputGroup, InputRightElement, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";


const Login = () => {
    const URL = "https://lms-gr4j.onrender.com/";

    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [LoginVisible, setLoginVisible] = useState(false);
    const [load, setLoad] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conpassword, setConPassword] = useState("");

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPass, setLoginPass] = useState("");

    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick1 = () => setVisible1(!visible1)
    const handleClick2 = () => setVisible2(!visible2)
    const loginhandleClick = () => setLoginVisible(!LoginVisible)
    const handleLogin = async () => {
        const payload = {
            email: loginEmail,
            password: loginPass
        };

        setLoad(true);

        try {
            const res = await axios.post(`${URL}users/login`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setLoad(false);

            if (res.status === 200) {
                toast({
                    title: "Successfully logged in",
                    description: "You are successfully logged in",
                    status: "success",
                    duration: 4000,
                    position: "bottom",
                    isClosable: true
                });

                dispatch({ type: LOGIN, payload: res.data });
                navigate("/books");
            } else if (res.status === 201) {
                toast({
                    title: "Something went wrong.",
                    description: "Something went wrong while checking the password.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                });
            } else if (res.status === 202) {
                toast({
                    title: "User is not Registered",
                    description: "User is not registered, please register.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                });
            }
        } catch (error) {
            setLoad(false);
            toast({
                title: "Login Failed",
                description: "Something went wrong, please try again",
                status: "error",
                duration: 4000,
                position: "bottom",
                isClosable: true
            });
        }
    };



    const handleRegisterCreator = async () => {
        if (conpassword === password) {
            if (username === "" || email === "") {
                toast({
                    title: "Please provide required information",
                    description: "Please fill in all the information to continue",
                    status: "error",
                    duration: 4000,
                    position: "bottom",
                    isClosable: true
                });
                return;
            }
            const payload = {
                username: username,
                email: email,
                password: password,
                roles: ["CREATOR", "VIEWER"]
            };

            try {
                const response = await fetch(`${URL}users/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.status === 200) {
                    toast({
                        title: 'Account created',
                        description: "We've created your account for you",
                        status: 'success',
                        position: "bottom",
                        duration: 4000,
                        isClosable: true,
                    });

                    setUsername("");
                    setConPassword("");
                    setEmail("");
                    setPassword("");
                } else if (response.status === 201) {
                    toast({
                        title: "Email is Already Present",
                        description: "This email ID is already exist, Please use another email ID.",
                        status: "info",
                        position: "bottom",
                        duration: 3000,
                        isClosable: true
                    });
                } else if (response.status === 202) {
                    toast({
                        title: "Something went wrong.",
                        description: "Something went wrong while hashing.",
                        status: "error",
                        position: "bottom",
                        duration: 3000,
                        isClosable: true
                    });
                } else {
                    toast({
                        title: 'Registration failed',
                        description: "Something went wrong",
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                toast({
                    title: "Something went wrong.",
                    description: "Something went wrong, Please try again.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                });
            }
        } else {
            toast({
                title: 'Password Error',
                description: "Password and Confirm password should be the same",
                status: 'info',
                position: "bottom",
                duration: 4000,
                isClosable: true,
            });
        }
    };

    const handleRegisterViewer = async () => {
        if (conpassword === password) {
            if (username === "" || email === "") {
                toast({
                    title: "Please provide required information",
                    description: "Please fill in all the information to continue",
                    status: "error",
                    duration: 4000,
                    position: "bottom",
                    isClosable: true
                });
                return;
            }
            const payload = {
                username: username,
                email: email,
                password: password,
                roles: ["VIEW_ALL"]
            };

            try {
                const response = await fetch(`${URL}users/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.status === 200) {
                    toast({
                        title: 'Account created',
                        description: "We've created your account for you",
                        status: 'success',
                        position: "bottom",
                        duration: 4000,
                        isClosable: true,
                    });

                    setUsername("");
                    setConPassword("");
                    setEmail("");
                    setPassword("");
                } else if (response.status === 201) {
                    toast({
                        title: "Email is Already Present",
                        description: "This email ID is already exist, Please use another email ID.",
                        status: "info",
                        position: "bottom",
                        duration: 3000,
                        isClosable: true
                    });
                } else if (response.status === 202) {
                    toast({
                        title: "Something went wrong.",
                        description: "Something went wrong while hashing.",
                        status: "error",
                        position: "bottom",
                        duration: 3000,
                        isClosable: true
                    });
                } else {
                    toast({
                        title: 'Registration failed',
                        description: "Something went wrong",
                        status: 'error',
                        duration: 4000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                toast({
                    title: "Something went wrong.",
                    description: "Something went wrong, Please try again.",
                    status: "error",
                    position: "bottom",
                    duration: 3000,
                    isClosable: true
                });
            }
        } else {
            toast({
                title: 'Password Error',
                description: "Password and Confirm password should be the same",
                status: 'info',
                position: "bottom",
                duration: 4000,
                isClosable: true,
            });
        }
    }

    return <Box display={"flex"} height={"90vh"} alignItems={"center"} bg={"#ffc1fb"} color={"black"}>
        <Tabs w={["100%", "100%", "80%", "50%", "50%"]} isFitted variant={"soft-rounded"} colorScheme="blue" m={"auto"} justifyContent={"center"} p={"2%"}>
            <TabList m={"auto"} textAlign={"center"} >
                <Tab m={"auto"} fontSize={"larger"} >Login</Tab>
                <Tab m={"auto"} fontSize={"larger"} >Register</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <FormControl textAlign={"center"} w={"90%"} m={"auto"}>
                        <InputGroup>
                            <Input placeholder="Enter Registered Email" type="email" isRequired m={1} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} id="loginEmail" borderColor={"purple.500"} bgColor={"white"} />
                        </InputGroup>
                        <InputGroup w={"100%"}>
                            <Input placeholder="Enter Password" type={LoginVisible ? "text" : "password"} isRequired m={1} value={loginPass} onChange={(e) => setLoginPass(e.target.value)} id="loginPassword" borderColor={"purple.500"} bgColor={"white"} />
                            <InputRightElement m={1} >
                                <IconButton onClick={loginhandleClick} size={"sm"} fontSize={"md"} colorScheme="purple" icon={LoginVisible ? <ViewOffIcon /> : <ViewIcon />} />
                            </InputRightElement>
                        </InputGroup>
                        <Button colorScheme="purple" m={"auto"} onClick={handleLogin} isLoading={load} spinnerPlacement='start'>Login</Button>
                    </FormControl>
                </TabPanel>
                <TabPanel>
                    <FormControl textAlign={"center"} w={"90%"} m={"auto"}>
                        <InputGroup>
                            <Input placeholder="Enter Username" id="username" type="text" isRequired m={1} value={username} onChange={(e) => setUsername(e.target.value)} borderColor={"purple.500"} bgColor={"white"} />
                        </InputGroup>
                        <InputGroup>
                            <Input placeholder="Enter Email" type="email" id="email" isRequired m={1} value={email} onChange={(e) => setEmail(e.target.value)} borderColor={"purple.500"} bgColor={"white"} />
                        </InputGroup>
                        <InputGroup>
                            <Input placeholder="Enter Password" type={visible1 ? "text" : "password"} id="password" isRequired m={1} value={password} onChange={(e) => setPassword(e.target.value)} borderColor={"purple.500"} bgColor={"white"} />
                            <InputRightElement m={1} >
                                <IconButton onClick={handleClick1} size={"sm"} fontSize={"md"} colorScheme="purple" icon={visible1 ? <ViewOffIcon /> : <ViewIcon />} />
                            </InputRightElement>
                        </InputGroup>
                        <InputGroup>
                            <Input placeholder="Enter Confirm Password" type={visible2 ? "text" : "password"} id="confirm_password" isRequired m={1} value={conpassword} onChange={(e) => setConPassword(e.target.value)} borderColor={"purple.500"} bgColor={"white"} />
                            <InputRightElement m={1} >
                                <IconButton onClick={handleClick2} size={"sm"} fontSize={"md"} colorScheme="purple" icon={visible2 ? <ViewOffIcon /> : <ViewIcon />} />
                            </InputRightElement>
                        </InputGroup>
                        <Stack direction={["column", "column", "row", "row", "row"]} w={"fit-content"} m={"auto"}>
                            <Button display={"block"} colorScheme="blue" m={"auto"} onClick={handleRegisterCreator}>Register as Creator</Button>
                            <Button display={"block"} colorScheme="purple" m={"auto"} onClick={handleRegisterViewer}>Register as Viewer</Button>
                        </Stack>
                    </FormControl>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Box>
}
export default Login;