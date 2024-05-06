import { useEffect, useState } from "react";
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
  Checkbox
} from "@chakra-ui/react";
import {Route} from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import { useCapslock } from "../provider/CheckCapslock";

// Define Validation Rules
const schema = yup.object().shape({
  email: yup.string().required('Please enter your email'),
  password: yup.string()
})



const LoginRotate = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError,setServerError]=useState("")
  //Add detect if capslock on or off
  const capslockState = useCapslock();
  const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
    mode: 'onSubmit', // Real-time validation
    resolver: yupResolver(schema)
  });
  const handleShowClick = () => setShowPassword(!showPassword);
//--------------------------------------------------------------------------------------------------//
//Submit form
const onSubmit = async (data) => {
  try {
    const requestBody = {
      ...data,
    };
    let result = await fetch("http://localhost:5000/login2/login2", {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
      });
    if (result.status === 200) {
      //store JWT token in localstorage
      const response=await result.json();
      localStorage.setItem("accessToken",response.accessToken)
      localStorage.setItem("refreshToken",response.refreshToken)
      alert("Login successful");
      console.log(response.refreshToken);
      window.location.href="./" //After singup success, relocate to login page
    } else if (result.status === 400) {
      setServerError(await result.text()); // Set the server error message
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
        <Heading color="teal.400">Welcome</Heading>
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
                  <Input type="email" placeholder="email address" {...register('email')} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register('password')}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {serverError && <p>{serverError}</p>}
                {capslockState ? <p>Caps Lock is active!</p> : null}
                <Stack direction="row" width="100%" justifyContent="end">
                  <FormHelperText>
                    <Link>forgot password?</Link>
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
        New to us?{" "}
        <Link color="teal.500" href="/signup">
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};

export default LoginRotate