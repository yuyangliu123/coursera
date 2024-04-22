import React,{ useEffect, useRef, useState }  from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Input,
  VStack,
  Select
} from "@chakra-ui/react";
import theme from '../../theme';

//--------------------------------------------------------------------------------------------------//
// Define Validation Rules
const schema = yup.object().shape({
  fname:yup.string().required("First Name is required"),
  email: yup.string().email('請輸入有效的電子郵件地址').required('電子郵件是必填項'),
  password: yup.string().min(4, '密碼至少4位').required('密碼是必填項'),
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
    let result = await fetch("http://localhost:5000/register", {
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
    const response = await fetch(`http://localhost:5000/checkReservation?resDate=${date}&resTime=${time}`);
    const data = await response.json();
    if (data.length>0) {
      setResAvailable(false)
      alert("This time slot is already booked. Please choose another one.");
    }else{
      setResAvailable(true)
    }
  };
//--------------------------------------------------------------------------------------------------//



  return (
    <VStack bg="gray.100"  height="auto" width="100vw" padding={{base:"20vh 0", xl:"23vh 0"}}>
      <Box margin="auto" >
      <Box bg="white" padding={10} rounded="md" height="auto" width={{base:"30vh",xl:"50vh"}} fontSize={{base:"1.5em",lg:"2em"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="flex-start">
            <label>First Name</label>
            <Input name="fname" ref={fnameRef} {...register('fname')} />
            {errors.fname && <p>{errors.fname.message}</p>}


            <label>Email</label>
            <Input name="email" ref={emailRef} {...register('email')} />
            {errors.email && <p>{errors.email.message}</p>}


            <label>Password</label>
            <Input type="password" name="password" {...register('password')} />
            {errors.password && <p>{errors.password.message}</p>}


            <label>Number of People</label>
            <Input type="number" name="numberOfPeople"  ref={numberOfPeopleRef} {...register('numberOfPeople')} />
            {errors.numberOfPeople && <p>{errors.numberOfPeople.message}</p>}


            <label>Date</label>
            <Input type="date" name="resDate" {...register('resDate')} />
            {errors.resDate && <p>{errors.resDate.message}</p>}


            <label htmlFor="res-time">Choose time</label>
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


            <label htmlFor="occasion">Occasion</label>
            <Select id="occasion" {...register("occasion", { required: true })}>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
            </Select>
            {errors.occasion && <span>This field is required</span>}


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
      </Box>
    </VStack>
  );
}
export default BookingForm