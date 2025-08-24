import { useEffect, useState, useRef, useContext } from "react";
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
import ModalPage from "../provider/ModalPage";
import { GlobalContext } from "../provider/GlobalModalContext";




const LoginRotate = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const capslockState = useCapslock();
  const { modalOpen, setModalOpen,setLoadSignup,setLoadForgotPass } = useContext(ModalContext);
  // Define Validation Rules
  const schema = yup.object().shape({
    email: yup.string().required("Please enter your email"),
    password: yup.string().required("Please enter your password"),
  });


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
        setTimeout(() => {
          window.location.href = "./" //After singup success, relocate to login page
        }, 2000)
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
      console.error("Error:", error);
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
                {errors.password && <p>{errors.password.message}</p>}
                {serverError && <p>{serverError}</p>}
                {capslockState && <p>Caps Lock is active!</p>}
                <Stack direction="row" width="100%" justifyContent="end">
                  <FormHelperText>
                    <Link
                    onClick={() => {
                      setModalState("forgot")
                      setLoadForgotPass(true)
                    }}>
                      forgot password?
                    </Link>
                  </FormHelperText>
                </Stack>
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
        <Box width="fit-content" margin="auto">
          New to us?{" "}
          <Link
          color="teal.500"
          onClick={() => {
            setModalState("signup")
            setLoadSignup(true)
            }}>
            Sign Up
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default LoginRotate;
