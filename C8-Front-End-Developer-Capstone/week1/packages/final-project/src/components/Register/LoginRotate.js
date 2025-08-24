import { useEffect, useState, useRef, useContext, lazy } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputRightElement,
  FormControl,
  FormHelperText,
  useToast,
  Box,
  Link,
  HStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useCapslock } from "../provider/CheckCapslock";
import axios from 'axios'
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { ModalContext } from "../provider/ModalContext";
import useClickOutside from "../provider/useClickOutside";
import { SmallCloseIcon } from "@chakra-ui/icons";
// import ModalPage from "../provider/ModalPage";
import { GlobalContext } from "../provider/GlobalModalContext";
import { Modal, ModalButton, ModalContent, useModal } from "../provider/ModalsSystem.js";
import { useNavigate } from "react-router-dom";
import { useUserRotate, useToken } from "../provider/JwtTokenRotate.js";
// const Signup = lazy(() => import("../Register/Signup"))
// const ForgotPassword = lazy(() => import("../Register/ForgotPassword"))
import Signup from "./Signup.js"
import ForgotPassword from "./ForgotPassword.js"
import { useLocation } from "react-router-dom";




const LoginRotate = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { lname, email, availableAccessToken, accessToken, isEmail } = useUserRotate();
  const { updateToken } = useToken();
  const { closeModal } = useModal()
  const capslockState = useCapslock();
  const navigate = useNavigate()
  const location = useLocation();
  const { modalOpen, setModalOpen, setLoadSignup, setLoadForgotPass } = useContext(ModalContext);
  // Define Validation Rules
  const schema = yup.object().shape({
    email: yup.string().required("Please enter your email"),
    password: yup.string().required("Please enter your password"),
  });
  //////here///////////// modalOpen時點input會讓"../provider/ModalContext" document.body.style.overflow = modalOpen ? "hidden" : "unset"失效

  useEffect(() => {
    console.log(availableAccessToken, "availableAccessToken test");

  }, [availableAccessToken])



  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const userEmail = watch('email');

  const handleShowClick = () => setShowPassword(!showPassword);
  const toast = useToast();

  // use useEffect & useRef to deal with autofill not trigger onChange problem
  const emailRef = useRef();

  useEffect(() => {
    // Set a timer to check if the input value has been autofilled.
    const timer = setTimeout(() => {
      const refs = [emailRef];
      const values = [userEmail];

      refs.forEach((ref, index) => {
        if (ref.current && ref.current.value !== values[index]) {
          ref.current.value = values[index];
        }
      });
    }, 100);

    // Cleanup function will run when the component unmounts or when the dependencies of useEffect change.
    return () => clearTimeout(timer);
  }, [userEmail]);

  // Submit form
  const onSubmit = async (data) => {
    try {
      const requestBody = {
        ...data,
      };
      const result = await axios.post("http://localhost:5000/login2/login2", requestBody, {
        withCredentials: true, // Allow credentials (cookies, authorization headers, etc.)
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.status === 200) {
        const response = result.data;
        //set at & rt to local storage
        localStorage.setItem("accessToken", response.accessToken);
        // Set csrf_token in cookie
        const csrf_token = uuidv4();
        Cookies.set('X-CSRF-Token', csrf_token, { secure: true, sameSite: 'strict' });
        toast({
          title: "Login Success",
          description: "You will soon be redirected",
          status: "success",
          duration: 2000,
        });

        const latestUserState = await updateToken(); // Get the latest state returned by updateToken
        closeModal()
        console.log(latestUserState.availableAccessToken, latestUserState, "availableAccessToken test1"); // Use the returned value here

        ///////here//////////////////////////////////////////////////////
        if (onLoginSuccess) {
          onLoginSuccess({ token: response.accessToken });

        } else {
          // setTimeout(() => {
          //   if(location.pathname!=="/"){
          //   navigate("/") //After signup success, relocate to login page

          //   }

          //   console.log(availableAccessToken, "availableAccessToken test2");
          // }, 2000)
        }

      } else if (result.status === 400) {
        setServerError(result.statusText);
        toast({
          title: "Login Failed",
          description: "Something Went Wrong",
          status: "error",
          duration: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login Failed";
      setServerError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        status: "error",
        duration: 2000,
      });
      console.log("Error:", error);
    }
  };

  const { setModalState } = useContext(GlobalContext);

  return (
    <>
      <Stack
        direction="column"
        marginBottom="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} p="1rem" backgroundColor="white" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <Input
                    type="email"
                    placeholder="email address"
                    ref={emailRef}
                    {...register("email")}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <HStack width="100%" justifyContent="space-between" textStyle="StyledText" fontSize="1rem" color="#000000">
                  <Box>
                    {errors.password && <p>{errors.password.message}</p>}
                    {serverError && <p>{serverError}</p>}
                    {capslockState && <p>Caps Lock is active!</p>}
                  </Box>
                  <Box justifyContent="end">
                    <FormHelperText>
                      {/* <Link
                        onClick={() => {
                          setTimeout(() => {
                            setModalState("forgot")
                            setLoadForgotPass(true)
                          }, 0);
                        }}>
                        forgot password?
                      </Link> */}
                      <ModalButton nest targetContent={<ForgotPassword />}>
                        forgot password?
                      </ModalButton>
                    </FormHelperText>
                  </Box>


                </HStack>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        <HStack width="fit-content" margin="auto">
          <Box>
            New to us?{" "}
          </Box>

          {/* //here */}
          {/* <Link
            color="teal.500"
            onClick={() => {
              setTimeout(() => {
                setModalState("signup")
                setLoadSignup(true)
              }, 0);
            }}>
            Sign Up
          </Link> */}
          <ModalButton color="teal.500" nest targetContent={<Signup />}>
            Signup
          </ModalButton>
        </HStack>
      </Box>
    </>
  );
};

export default LoginRotate;
