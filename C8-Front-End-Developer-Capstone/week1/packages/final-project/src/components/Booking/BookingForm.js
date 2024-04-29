import React,{ useEffect, useMemo, useRef, useState }  from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Input,
  VStack,
  Select,
  Stack,
  Flex,
  Heading,
  FormControl
} from "@chakra-ui/react";
import theme from '../../theme';

//--------------------------------------------------------------------------------------------------//
// Define Validation Rules
const schema = yup.object().shape({
  numberOfPeople: yup.number().typeError('人數必須是數字').min(1, '至少一人').max(20,"最多20人").required('人數是必填項'),
  resTime: yup.string().required('Reservation time is required'),
  resDate: yup.date().typeError('請輸入有效日期').required('日期是必填項'),
  occasion: yup.string().oneOf(['Birthday', 'Anniversary'], '必須是 Birthday 或 Anniversary').required('場合是必填項'),
});
//--------------------------------------------------------------------------------------------------//
const BookingForm = () => {
  const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
    mode: 'onChange', // Real-time validation
    resolver: yupResolver(schema)
  });

//--------------------------------------------------------------------------------------------------//
  // Monitor the Changes in Form Values
  const fname = watch('fname');
  const email = watch('email');
  const password = watch('password');
  const numberOfPeople = watch('numberOfPeople');
  const resTime = watch('resTime');
  const resDate = watch('resDate');
  const occasion = watch('occasion');
//--------------------------------------------------------------------------------------------------//


//--------------------------------------------------------------------------------------------------//
//Submit form
const onSubmit = async (e) => {
  try {
    let result = await fetch("http://localhost:5000/reservation/register", {
      method: "post",
      body: JSON.stringify({ fname, email, password, numberOfPeople, resTime, resDate, occasion }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    result = await result.json();
    console.warn(result);
    if (result) {
      console.log(result);
      alert("Data save succesfully");
      window.location.reload()//Add this to deal with autofill not trigger onChange problem when consecutive submissions
      console.log(isResAvailable);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

//--------------------------------------------------------------------------------------------------//


//--------------------------------------------------------------------------------------------------//
//use useEffect & useRef to deal with autofill not trigger onChange problem
//Because the autofill problem continues to occur with consecutive submissions,
//I added a window.location.reload() in onSubmit to refresh the entire webpage.
const fnameRef = useRef();
const emailRef = useRef();
const numberOfPeopleRef = useRef();
  useEffect(() => {
    // Set a timer to check if the input value has been autofilled.
    const timer = setTimeout(() => {
      if (fnameRef.current && fnameRef.current.value !== fname) {
        fnameRef.current = fname;
      }
      if (emailRef.current && emailRef.current.value !== email) {
        emailRef.current = email;
      }
      if (numberOfPeopleRef.current && numberOfPeopleRef.current.value !== numberOfPeople) {
        numberOfPeopleRef.current = numberOfPeople;
      }
    }, 100); // check every 50ms

    // Cleanup function will run when the component unmounts or when the dependencies of useEffect change.
    return () => clearTimeout(timer);
  }, [fname, email,numberOfPeople]); // depand on fname, email, numberOfPeople
//--------------------------------------------------------------------------------------------------//



//--------------------------------------------------------------------------------------------------//
//After the user selects a date and time, call the checkReservation function to search for the date and time
//at http://localhost:5000/checkReservation that matches the user’s selection.
//If the returned value is not null (meaning it has been booked), an alert will pop up. And order botton'll been blocked

//check if reservation is available or not
  const [isResAvailable, setResAvailable] = useState();

  useEffect(() => {
    if (resDate && resTime) {
      checkReservation(resDate, resTime);
    }
  }, [resDate, resTime]);
  const checkReservation = async (date,time) => {
    const response = await fetch(`http://localhost:5000/reservation/checkReservation?resDate=${date}&resTime=${time}`);
    const data = await response.json();
    if (data.length>0) {
      setResAvailable(false)
      alert("This time slot is already booked. Please choose another one.");
    }else{
      setResAvailable(true)
    }
  };
//--------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------//
//Set choose date placeholder
  const [inputType,setInputType]=useState("text")
  const handleFocus=()=>{setInputType("date")}
  const handleBlur=()=>{setInputType("text")}

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
      <Heading color="#F4CE14">Reserve Now!</Heading>
      <Box bg="white" padding={10} rounded="md" height="auto" minW={{ base: "90%", md: "468px" }} fontSize={{base:"1.5em",lg:"2em"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="flex-start">
          <FormControl>
            <Input type="number" name="numberOfPeople"  ref={numberOfPeopleRef} {...register('numberOfPeople')} placeholder='Number of People'/>
            {errors.numberOfPeople && <p>{errors.numberOfPeople.message}</p>}
          </FormControl>
          <FormControl>
            <Input type={inputType} name="resDate" {...register('resDate')} placeholder='Choose Date'
            onFocus={handleFocus} onBlur={handleBlur}/>
            {errors.resDate && <p>{errors.resDate.message}</p>}
          </FormControl>
          <FormControl>
            <Select id="res-time" {...register("resTime", { required: true })}>
              <option value="">--Choose Time--</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
            </Select>
            {errors.resTime && <span>This field is required</span>}
          </FormControl>
          <FormControl>
            <Select id="occasion" {...register("occasion", { required: true })}>
              <option value="">--Occasion--</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
            </Select>
            {errors.occasion && <span>This field is required</span>}
          </FormControl>

            <Button
            type="submit"
            size={{xl:"lg",base:"md"}}
            backgroundColor={(isValid && isResAvailable)?"#F4CE14":"lightgrey"}
            isDisabled={!(isValid && isResAvailable)}
            >
              Order!
            </Button>
          </VStack>
        </form>
      </Box>
      </Stack>
    </Flex>
  );
}
export default BookingForm