import { useState, useRef, useEffect } from "react";
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
  useToast,
  HStack,
  Checkbox
} from "@chakra-ui/react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCapslock } from "../provider/CheckCapslock";
import axios from "axios";




const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const capslockState = useCapslock();

  //--------------------------------------------------------------------------------------------------//
  // Define Validation Rules
  const schema = yup.object().shape({
    fname: yup.string().required("First Name is required"),
    lname: yup.string().required("Last Name is required"),
    email: yup.string().email('Enter Valid Email').required('Email is required'),
    password: yup.string().min(8, 'At least 8 words').required('Password is required'),
    confirm: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm your password')
  })

  //--------------------------------------------------------------------------------------------------//

  const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
    mode: 'onSubmit', // Real-time validation
    resolver: yupResolver(schema)
  });

  //--------------------------------------------------------------------------------------------------//
  const fname = watch("fname")
  const lname = watch("lname")
  const email = watch("email")
  const password = watch("password")
  const confirm = watch("confirm")
  //--------------------------------------------------------------------------------------------------//
  const toast = useToast();
  //--------------------------------------------------------------------------------------------------//
  // use useEffect & useRef to deal with autofill not trigger onChange problem
  const fnameRef = useRef();
  const lnameRef = useRef();
  const emailRef = useRef();
  useEffect(() => {
    // Set a timer to check if the input value has been autofilled.
    const timer = setTimeout(() => {
      const refs = [fnameRef, lnameRef, emailRef]
      const values = [fname, lname, email];

      refs.forEach((ref, index) => {
        if (ref.current && ref.current.value !== values[index]) {
          ref.current.value = values[index];
        }
      });
    }, 100);

    // Cleanup function will run when the component unmounts or when the dependencies of useEffect change.
    return () => clearTimeout(timer);
  }, [fname, lname, email]);

  //Submit form
  const onSubmit = async (data) => {
    try {
      let result = await axios.post("http://localhost:5000/signup/register", data);
      if (result.status === 400) {
        setServerError(await result.text());
      } else {
        if (result) {
          console.log(result);
          toast({
            title: "Sign Up Success",
            description: "You will soon be redirected",
            status: "success",
            duration: 2000,
          });
          reset();
          setTimeout(() => {
            window.location.href = "./loginrotate";//After singup success, relocate to login page
          }, 2000)
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //--------------------------------------------------------------------------------------------------//


  const handleShowClick = () => setShowPassword(!showPassword);
  return (
    <>
      <Stack
        direction="column"
        marginBottom="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="teal.400">Sign Up</Heading>
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
                  <Input type="text" ref={fnameRef} placeholder="First Name" {...register('fname')} />
                </InputGroup>
                {errors.fname && <p>{errors.fname.message}</p>}
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input type="text" ref={lnameRef} placeholder="Last Name" {...register('lname')} />
                </InputGroup>
                {errors.lname && <p>{errors.lname.message}</p>}
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input type="email" ref={emailRef} placeholder="Email Address" {...register('email')} />
                </InputGroup>
                {errors.email && <p>{errors.email.message}</p>}{serverError && <p>{serverError}</p>}
              </FormControl>
              <HStack>
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
              </HStack>
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
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        <Box width="fit-content" margin="auto">
          Already have an account? {" "}
          <Link color="teal.500" href="/loginrotate">
            Login
          </Link>
        </Box>
      </Box>
    </>
  )
}

export default Signup
