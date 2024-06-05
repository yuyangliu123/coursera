import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
  FormControl,
  useToast
} from "@chakra-ui/react";
import theme from '../../theme';
import { useUserRotate } from '../provider/JwtTokenRotate';
import { useCapslock } from '../provider/CheckCapslock';




const BookingForm = () => {
  // Define Validation Rules
const schema = useMemo(() => yup.object().shape(localStorage.getItem("accessToken") ? {
  numberOfPeople: yup.number().typeError('人數必須是數字').min(1, '至少一人').max(20, "最多20人").required('人數是必填項'),
  resTime: yup.string().required('Reservation time is required'),
  resDate: yup.date().typeError('請輸入有效日期').required('日期是必填項'),
  occasion: yup.string().oneOf(['Birthday', 'Anniversary'], '必須是 Birthday 或 Anniversary').required('場合是必填項'),
} : {
  fname: yup.string().required("First name is required"),
  email: yup.string().email('請輸入有效的電子郵件地址').required('電子郵件是必填項'),
  numberOfPeople: yup.number().typeError('人數必須是數字').min(1, '至少一人').max(20, "最多20人").required('人數是必填項'),
  resTime: yup.string().required('Reservation time is required'),
  resDate: yup.date().typeError('請輸入有效日期').required('日期是必填項'),
  occasion: yup.string().oneOf(['Birthday', 'Anniversary'], '必須是 Birthday 或 Anniversary').required('場合是必填項'),
}), []);

  const { register, handleSubmit, watch, formState: { errors, isValid }, reset } = useForm({
    mode: 'onChange', // Real-time validation
    resolver: yupResolver(schema)
  });

  const { fname, email, availableAccessToken } = useUserRotate();
  const toast = useToast();

  // Monitor the Changes in Form Values
  const userFname = watch('fname');
  const userEmail = watch('email');
  const numberOfPeople = watch('numberOfPeople');
  const resTime = watch('resTime');
  const resDate = watch('resDate');
  const occasion = watch('occasion');

  // Submit form
  const onSubmit = useCallback(async (data) => {
    try {
      const result = await fetch("http://localhost:5000/reservation/reservation", {
        method: "post",
        body: JSON.stringify(availableAccessToken ? { fname, email, numberOfPeople, resTime, resDate, occasion }
          : { fname: userFname, email: userEmail, numberOfPeople, resTime, resDate, occasion }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const resultJson = await result.json();
      console.warn(resultJson);
      if (resultJson) {
        console.log(resultJson);
        toast({
          title: "Reserve Successfully",
          status: "success",
          duration: 2000,
        })
        setTimeout(() => {
          window.location.href = "./"; // After signup success, relocate to login page
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [availableAccessToken, fname, email, numberOfPeople, resTime, resDate, occasion, userFname, userEmail, toast]);

  // Add detect if capslock on or off
  const capslockState = useCapslock();

  // use useEffect & useRef to deal with autofill not trigger onChange problem
  const fnameRef = useRef();
  const emailRef = useRef();
  const numberOfPeopleRef = useRef();

  useEffect(() => {
    // Set a timer to check if the input value has been autofilled.
    const timer = setTimeout(() => {
      if (fnameRef.current && fnameRef.current.value !== userFname) {
        fnameRef.current.value = userFname;
      }
      if (emailRef.current && emailRef.current.value !== userEmail) {
        emailRef.current.value = userEmail;
      }
      if (numberOfPeopleRef.current && numberOfPeopleRef.current.value !== numberOfPeople) {
        numberOfPeopleRef.current.value = numberOfPeople;
      }
    }, 100);

    // Cleanup function will run when the component unmounts or when the dependencies of useEffect change.
    return () => clearTimeout(timer);
  }, [userFname, userEmail, numberOfPeople]);

  // Check if reservation is available or not
  const [isResAvailable, setResAvailable] = useState();

  const checkReservation = useCallback(async (date, time) => {
    const response = await fetch(`http://localhost:5000/reservation/checkReservation?resDate=${date}&resTime=${time}`);
    const data = await response.json();
    if (data.length > 0) {
      setResAvailable(false)
      toast({
        title: "Opps!",
        description: "This time slot is already booked. Please choose another one.",
        status: "error",
        duration: 3000,
      })
    } else {
      setResAvailable(true)
    }
  }, [toast]);

  useEffect(() => {
    if (resDate && resTime) {
      checkReservation(resDate, resTime);
    }
  }, [resDate, resTime, checkReservation]);

  // Set choose date placeholder
  const [inputType, setInputType] = useState("text");
  const handleFocus = () => { setInputType("date") }
  const handleBlur = () => { setInputType("text") }

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
        <Box bg="white" padding={10} rounded="md" height="auto" minW={{ base: "90%", md: "468px" }} fontSize={{ base: "1.5em", lg: "2em" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="flex-start">
              {!availableAccessToken &&
                <>
                  <FormControl>
                    <Input name="fname" ref={fnameRef} {...register('fname')} placeholder='First Name' />
                    {errors.fname && <p>{errors.fname.message}</p>}
                  </FormControl>
                  <FormControl>
                    <Input name="email" ref={emailRef} {...register('email')} placeholder='Email' />
                    {errors.email && <p>{errors.email.message}</p>}
                  </FormControl>
                </>
              }

              <FormControl>
                <Input type="number" name="numberOfPeople" ref={numberOfPeopleRef} {...register('numberOfPeople')} placeholder='Number of People' />
                {errors.numberOfPeople && <p>{errors.numberOfPeople.message}</p>}
              </FormControl>
              <FormControl>
                <Input type={inputType} name="resDate" {...register('resDate')} placeholder='Choose Date'
                  onFocus={handleFocus} onBlur={handleBlur} />
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
              {capslockState ? <p>Caps Lock is active!</p> : null}
              <Button
                type="submit"
                size={{ xl: "lg", base: "md" }}
                backgroundColor={(isValid && isResAvailable) ? "#F4CE14" : "lightgrey"}
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
export default BookingForm;
