import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";
import useSubmit from "./useSubmit";
import styled from "styled-components";

const schema = yup.object().shape({
  firstName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  comment: yup.string().min(25, "Must be at leat 25 characters").required("Required"),
});

const ContactMeSection = () => {
  const Contact = styled.div`
    // Your styles here
  `;

  const { isLoading, response, submit } = useSubmit();

  const { register, handleSubmit, formState: { errors }, trigger, setError } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    submit("", data);
  };

  return (
    <FullScreenSection
      isDarkBackground
      backgroundColor="#512DA8"
      py={16}
      spacing={8}>
      <VStack p={32} alignItems="flex-start">
        <h1>Contact me</h1>
        <Box p={6} rounded="md" w="100%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.firstName}>
              <FormLabel htmlFor="firstName">Name</FormLabel>
              <Input
                id="firstName"
                name="firstName"
                {...register('firstName')}
                onBlur={() => trigger('firstName')}
              />
              <FormErrorMessage>
                {errors.firstName?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input 
  type="email"
  id="email"
  name="email"
  {...register('email')}
  onBlur={async () => {
    const result = await trigger('email');
    if (!result) {
      setError('email', {
        type: 'manual',
        message: '請輸入電子郵件'
      });
    }
  }}
  onChange={async () => {
    const result = await trigger('email');
    if (!result) {
      setError('email', {
        type: 'manual',
        message: '請輸入有效的電子郵件'
      });
    }
  }}
/>
              <FormErrorMessage>
                {errors.email?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.comment}>
              <FormLabel htmlFor="comment">Comment</FormLabel>
              <Textarea
                id="comment"
                name="comment"
                {...register('comment')}
              />
              <FormErrorMessage>
                {errors.comment?.message}
              </FormErrorMessage>
            </FormControl>

            <div className="type">
              <label htmlFor="type">Type of enquiry</label>
              <br/>
              <select id="type" name="type" {...register('type')}>
                <option value="hireMe">Freelance project proposal</option>
                <option value="openSource">Open source consultancy session</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Button mt={4} colorScheme="teal" isLoading={isLoading} type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </VStack>
    </FullScreenSection>
  );
};

export default ContactMeSection;
