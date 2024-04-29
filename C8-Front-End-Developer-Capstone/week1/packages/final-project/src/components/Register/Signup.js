import { useState } from "react";
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
  HStack,
  Checkbox
} from "@chakra-ui/react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCapslock } from "../provider/CheckCapslock"; 
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




const Signup=()=>{
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');
    const capslockState = useCapslock();
    const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
      mode: 'onSubmit', // Real-time validation
      resolver: yupResolver(schema)
    });

//--------------------------------------------------------------------------------------------------//
const fname=watch("fname")
const lname=watch("lname")
const email=watch("email")
const password=watch("password")
const confirm=watch("confirm")
//--------------------------------------------------------------------------------------------------//


//--------------------------------------------------------------------------------------------------//
//Submit form
const onSubmit = async (e) => {
  try {
    let result = await fetch("http://localhost:5000/signup/register", {
      method: "post",
      body: JSON.stringify({ fname,lname, email, password,confirm}),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (result.status === 400) {
      setServerError(await result.text());
    } else {
      result = await result.json();
      console.warn(result);
      if (result) {
        console.log(result);
        alert(`Sign Up Successfully`);
        reset();
        window.location.href = "./login";//After singup success, relocate to login page
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

//--------------------------------------------------------------------------------------------------//


  const handleShowClick = () => setShowPassword(!showPassword);
    return(
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
                  <Input type="text" placeholder="First Name" {...register('fname')} />
                </InputGroup>
                {errors.fname && <p>{errors.fname.message}</p>}
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input type="text" placeholder="Last Name" {...register('lname')} />
                </InputGroup>
                {errors.lname && <p>{errors.lname.message}</p>}
              </FormControl>
              <FormControl>
                <InputGroup>
                  <Input type="email" placeholder="Email Address" {...register('email')} />
                </InputGroup>
                {errors.email && <p>{errors.email.message}</p>}{serverError&&<p>{serverError}</p>}
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
        Already have an account? {" "}
        <Link color="teal.500" href="/login">
          Login
        </Link>
      </Box>
    </Flex>
    )
}

export default Signup
