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
  useToast,
  RadioGroup,
  Radio,
  FormLabel,
  StatLabel,
  TagLabel,
  HStack,
  Wrap,
  WrapItem,
  Text,
} from "@chakra-ui/react";
import theme from '../../theme';
import { useUserRotate } from '../provider/JwtTokenRotate';
import { useCapslock } from '../provider/CheckCapslock';
import Cookies from "js-cookie";
import navConfig from '../Nav/config/navConfig';
import { apiClient } from '../provider/axiosInstanceWithTokenCheck';
import { useModal } from '../provider/ModalsSystem';

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

  const { register, handleSubmit, watch, formState: { errors, isValid }, setValue } = useForm({
    mode: 'onChange', // Real-time validation
    resolver: yupResolver(schema)
  });

  const { fname, identifier, availableAccessToken, isEmail, accessToken } = useUserRotate();
  const toast = useToast();
  const { closeModal } = useModal()

  // Monitor the Changes in Form Values
  const userFname = watch('fname');
  const userEmail = watch('email');
  const numberOfPeople = watch('numberOfPeople');
  const resTime = watch('resTime');
  const resDate = watch('resDate');
  const occasion = watch('occasion');

  const onSubmit = useCallback(async (data) => {
    try {
      const result = await apiClient.post("http://localhost:5000/reservation/reservation",
        availableAccessToken
          ? { fname, email: identifier, numberOfPeople, resTime, resDate, occasion }
          : { fname: userFname, email: userEmail, numberOfPeople, resTime, resDate, occasion });
      if (result) {
        toast({
          title: "Reserve Successfully",
          status: "success",
          duration: 2000,
        })
        closeModal()
        // setTimeout(() => {
        //   window.location.href = "./" //After booking success, relocate to homepage
        // }, 2000)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [availableAccessToken, fname, identifier, numberOfPeople, resTime, resDate, occasion, userFname, userEmail, toast]);

  const capslockState = useCapslock();

  const fnameRef = useRef();
  const emailRef = useRef();
  const numberOfPeopleRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      const refs = [fnameRef, emailRef, numberOfPeopleRef];
      const values = [userFname, userEmail, numberOfPeople];

      refs.forEach((ref, index) => {
        if (ref.current && ref.current.value !== values[index]) {
          ref.current.value = values[index];
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [userFname, userEmail, numberOfPeople]);

  const [isResAvailable, setResAvailable] = useState();

  const checkReservation = useCallback(async (date) => {
    //prevent invalid input
    if (!date || isNaN(Date.parse(date))) {
      setResAvailable(false);
      return;
    }

    const result = await apiClient.get(`http://localhost:5000/reservation/checkReservation?resDate=${date}`);
    if (result) {
      setResAvailable(result.data);
    }

  }, []);

  useEffect(() => {
    if (resDate) {
      checkReservation(resDate);
    }
  }, [resDate, checkReservation]);

  const [inputType, setInputType] = useState("text");
  const handleFocus = () => { setInputType("date") }
  const handleBlur = () => { setInputType("text") }

  return (
    <Stack
      direction="column"
      marginBottom="2"
      justifyContent="center"
      alignItems="center"
    >
      <Heading color="#F4CE14">Reserve Now!</Heading>
      <Box bg="white" padding={10} rounded="md" height="auto" minW={{ base: "90%", md: "468px" }} fontSize={{ base: "1.5em", [navConfig.showNavSize]: "2em" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="flex-start">
            {!isEmail &&
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
                onFocus={handleFocus}
                onBlur={(e) => {
                  handleBlur()
                  // checkReservation(e.target.value)
                }} />
              {errors.resDate && <p>{errors.resDate.message}</p>}
            </FormControl>
            <FormControl>
              {isResAvailable ? (
                <Wrap width="100%" justify="space-around">
                  {isResAvailable.map(({ time, isOrder }) => (
                    <WrapItem key={time}>
                      <Input type="radio" id={time} name="resTime" disabled={!isOrder} display="none" {...register('resTime')} value={time} />
                      <FormLabel
                        width="100%"
                        htmlFor={time}
                        style={{
                          background: isOrder ? '#F4CE14' : '#eee',
                          cursor: isOrder ? 'pointer' : 'not-allowed',
                          borderRadius: "10px",
                          textAlign: "center",
                          margin: 0,
                          border: document.getElementById(time)?.checked ? '2px solid #495E57' : 'none',
                        }}
                      >{time}</FormLabel>

                    </WrapItem>
                  ))}
                </Wrap>
              ) : (
                null
              )}
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
            {capslockState ? <Text textStyle="StyledText" fontSize="1rem" color="#000000">Caps Lock is active!</Text> : null}
            <Button
              type="submit"
              width="100%"
              backgroundColor={(isValid && isResAvailable) ? "#F4CE14" : "lightgrey"}
              isDisabled={!(isValid && isResAvailable)}
            >
              Order!
            </Button>
          </VStack>
        </form>
      </Box>
    </Stack>
  );
}

export default BookingForm;
