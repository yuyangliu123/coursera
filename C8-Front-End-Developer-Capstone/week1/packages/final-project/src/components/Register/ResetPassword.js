import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  Checkbox,
  useToast,
  Text,
  HStack
} from "@chakra-ui/react";
import { Route, useNavigate } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useCapslock } from "../provider/CheckCapslock";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Define Validation Rules
const schema = yup.object().shape({
  password: yup.string().min(8, 'At least 8 words').required('Password is required'),
  confirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm your password')
})



const ResetPassword = () => {
  const [resetState, setResetState] = useState({
    email: "",
    updated: false,
    isLoading: false,
    error: false,
  })
  //When a user clicks on a link, it automatically checks if the link is valid. If it’s invalid, an error page will be displayed.
  useEffect(() => {
    const asyncFc = async () => {
      //Get url token
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const decodeToken = jwtDecode(token)
      try {
        let result = await axios.post("http://localhost:5000/forgotpassword/checkvalidate", { email: decodeToken.email, token: decodeToken.token });
        if (result.status === 400) {
          setResetState(prevState => ({ ...prevState, updated: true, error: true }))
        } else if (result.status === 200) {
          setResetState(prevState => ({ ...prevState, updated: true, email: result.data.email }))
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    asyncFc()
  }, [])

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  //Add detect if capslock on or off
  const capslockState = useCapslock();
  const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
    mode: 'onSubmit', // Real-time validation
    resolver: yupResolver(schema)
  });


  //--------------------------------------------------------------------------------------------------//
  const password = watch("password")
  const confirm = watch("confirm")
  const toast = useToast()
  const navigate=useNavigate()
  //--------------------------------------------------------------------------------------------------//


  //--------------------------------------------------------------------------------------------------//
  //Submit form
  const onSubmit = async (data) => {
    try {
      let result = await axios.post("http://localhost:5000/forgotpassword/reset", { email: resetState.email, password });
      if (result) {
        if (result.status === 200) {
          toast({
            title: "Change password success",
            description: "You will soon be redirected",
            status: "success",
            duration: 2000,
          });
          //redirect to login page
          setTimeout(() => {
            window.location.href = "/"
          }, 2000);
        } else if (result.status === 402) {
          toast({
            title: "User does not exist",
            description: "Something Went Wrong",
            status: "error",
            duration: 3000,
          });
        } else if (result.status === 401) {
          toast({
            title: "The new password is the same as the old password.",
            description: "Please use another password",
            status: "error",
            duration: 3000,
          });
        } else if (result.status === 400) {
          toast({
            title: "Something Went Wrong",
            status: "error",
            duration: 3000,
          });
        }
      }

    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast({
            title: "Something Went Wrong",
            status: "error",
            duration: 3000,
          });
        } else if (error.response.status === 401) {
          toast({
            title: "The new password is the same as the old password.",
            description: "Please use another password",
            status: "error",
            duration: 3000,
          });
        } else if (error.response.status === 402) {
          toast({
            title: "User does not exist",
            description: "Something Went Wrong",
            status: "error",
            duration: 3000,
          });
        }
      }
    }
  };




  //--------------------------------------------------------------------------------------------------//
  if (resetState.updated === true) {
    //Error page
    if (resetState.error === true) {
      return (
        <Flex
          flexDirection="column"
          width="100wh"
          height="100vh"
          backgroundColor="gray.200"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            direction="column"
            marginBottom="2"
            justifyContent="center"
            alignItems="center"
          >
            <Heading color="teal.400">Problem resetting password</Heading>
            <p>Reset link expire or invalid link</p>
            <p>Please send another reset link</p>
            <HStack>
              <Button><Link href="/">Go Home</Link></Button>
              <Button><Link href="/forgotpassword">Forgot Password</Link></Button>
            </HStack>
          </Stack>
        </Flex>

      )
      //Reset password page
    } else if (resetState.email) {
      return (
        <Flex
          flexDirection="column"
          width="100wh"
          height="100vh"
          backgroundColor="gray.200"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            direction="column"
            marginBottom="2"
            justifyContent="center"
            alignItems="center"
          >
            <Heading color="teal.400">Reset your password</Heading>
            <Text color="teal.400">{"Please enter new password"}</Text>
            <Box minW={{ base: "90%", md: "468px" }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack
                  spacing={4}
                  p="1rem"
                  backgroundColor="white"
                  boxShadow="md"
                >
                  <FormControl>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...register('password')}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...register('confirm')}
                      />
                    </InputGroup>
                  </FormControl>
                  {errors.password && <p>{errors.password.message}</p>}
                  {!errors.password && errors.confirm && <p>{errors.confirm.message}</p>}
                  {capslockState ? <p>Caps Lock is active!</p> : null}
                  <Checkbox size="sm" isChecked={showPassword} onChange={handleShowClick}>
                    {showPassword ? "Hide Password" : "Show Password"}
                  </Checkbox>
                  <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="teal"
                    width="full"
                  >
                    Submit
                  </Button>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      );
    }
  }
};

export default ResetPassword