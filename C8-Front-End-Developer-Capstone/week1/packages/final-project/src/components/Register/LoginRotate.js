import { useEffect, useState } from "react";
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

// Define Validation Rules
const schema = yup.object().shape({
  email: yup.string().required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
});





const LoginRotate = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const capslockState = useCapslock();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
  const handleShowClick = () => setShowPassword(!showPassword);
  const toast = useToast();

  // Submit form
  const onSubmit = async (data) => {
    try {
      const requestBody = {
        ...data,
      };
      let result = await fetch("http://localhost:5000/login2/login2", {
        method: "post",
        body: JSON.stringify(requestBody),
        credentials:"include", // Allow credentials (cookies, authorization headers, etc.)
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.status === 200) {
        const response = await result.json();
        //set at & rt to local storage
        localStorage.setItem("accessToken", response.accessToken);
        toast({
          title: "Login Success",
          description: "You will soon be redirected",
          status: "success",
          duration: 2000,
        });
      } else if (result.status === 400) {
        setServerError(await result.text());
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
            <Stack spacing={4} p="1rem" backgroundColor="white" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <Input
                    type="email"
                    placeholder="email address"
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
                    <Link href="/forgotpassword">forgot password?</Link>
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

export default LoginRotate;
