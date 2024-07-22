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
  Text
} from "@chakra-ui/react";
import { Route } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useCapslock } from "../provider/CheckCapslock";
import axios from "axios";

// Define Validation Rules
const schema = yup.object().shape({
  email: yup.string().email('Please Enter Valid Email').required('Please Enter Your Email'),
})



const ForgotPassword = () => {
  const [serverError, setServerError] = useState("")
  //Add detect if capslock on or off
  const capslockState = useCapslock();
  const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
    mode: 'onSubmit', // Real-time validation
    resolver: yupResolver(schema)
  });
  const email = watch("email")
  const toast = useToast()

  //--------------------------------------------------------------------------------------------------//
  //use useEffect & useRef to deal with autofill not trigger onChange problem
  //Because the autofill problem continues to occur with consecutive submissions,
  //I added a window.location.reload() in onSubmit to refresh the entire webpage.
  const emailRef = useRef();
  useEffect(() => {
    // Set a timer to check if the input value has been autofilled.
    const timer = setTimeout(() => {
      if (emailRef.current && emailRef.current.value !== email) {
        emailRef.current = email;
      }
    }, 100); // check every 50ms

    // Cleanup function will run when the component unmounts or when the dependencies of useEffect change.
    return () => clearTimeout(timer);
  }, [email]); // depand on userFname, userEmail, numberOfPeople
  //--------------------------------------------------------------------------------------------------//

  //--------------------------------------------------------------------------------------------------//
  //Submit form

  const onSubmit = async (data) => {
    try {
      const requestBody = {
        ...data,
      };
      let result = await axios.post("http://localhost:5000/forgotpassword/send",requestBody);
      if (result.status === 200) {
        //store JWT token in localstorage
        toast({
          title: "A verification email has been sent",
          description: "Please click on the link in the email.",
          status: "success",
          duration: 3000,
        });
      } else if (result.status === 400) {
        setServerError(await result.text()); // Set the server error message
        toast({
          title: "User does not exist",
          description: "Please use another address",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };




  //--------------------------------------------------------------------------------------------------//
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
        <Text color="teal.400">{"Enter your email address and we’ll"}<br />{"send you a link to reset your password"}</Text>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="white"
              boxShadow="md"
            >
              <FormControl>
                <Input ref={emailRef} placeholder="email address" {...register('email')} />
                {errors.email && <p>{errors.email.message}</p>}
              </FormControl>
              {capslockState ? <p>Caps Lock is active!</p> : null}
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
};

export default ForgotPassword