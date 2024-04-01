import React, {useEffect} from "react";
import { useFormik } from "formik";
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
import * as Yup from 'yup';
import FullScreenSection from "./FullScreenSection";
import useSubmit from "./hooks/useSubmit";
import styled from "styled-components";

const ContactMeSection = () => {
    const Contact = styled.div`
        background-color: #512DA8;
        .container {
            padding: 2% 0;
            label {
                color: white;
                margin-bottom: 10px;
                display: inline-block;
            }
            h1 {
                margin: 0 0 0 0.5em;
                color: white;
            }
            form{
                width: 95%;
                margin:0 auto;
                
            }
            input, select, textarea,button {
                border-radius: 5px;
                height: 40px;
                width: 95%;
                color: white;
                
                display: inline-block;
            }
            input,select,textarea{
                border: 2px solid white;
                background-color: #512DA8;
            }
            textarea {
                height: 200px;
            }
            button{
                border: 2px solid #9885c6;
                background-color: #9885c6;
            }
        }
    `
    const { isLoading, response, submit }=useSubmit()

    const formik = useFormik({
        initialValues: {
          firstName: '',
          email: '',
          type: '',
          comment: ''
        },
        onSubmit: (values) => {submit("", values)},
        validationSchema: Yup.object({
          firstName: Yup.string().required("Required"),
          email: Yup.string().email("Invalid email").required("Required"),
          comment: Yup.string().min(25, "Must be at leat 25 characters").required("Required"),
        }),
      });

    return (
            <FullScreenSection 
            isDarkBackground
            backgroundColor="#512DA8"
            py={16}
            spacing={8}>
                <VStack p={32} alignItems="flex-start">
                <h1>Contact me</h1>
                <Box p={6} rounded="md" w="100%">
                <form onSubmit={formik.handleSubmit}>
                <FormControl isInvalid={!!formik.errors.firstName && formik.touched.firstName}>
                    <FormLabel htmlFor="firstName">Name</FormLabel>
                    <Input
                    id="firstName"
                    name="firstName"
                    {...formik.getFieldProps("firstName")}
                    />
                    
                    <FormErrorMessage>
                    {formik.errors.firstName}
                    </FormErrorMessage>
                </FormControl>

                    <FormControl  isInvalid={!!formik.errors.email && formik.touched.email}>
                        <label htmlFor="email">Email Address</label>
                        <br/>
                        <Input 
                            type="email"
                            id="email"
                            name="email"
                            {...formik.getFieldProps("email")}
                        />
                        
                        <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                    </FormControl>
                        
                    
                    <div className="type">
                        <label htmlFor="type">Type of enquiry</label>
                        <br/>
                        <select id="type" name="type">
                            <option value="hireMe">Freelance project proposal</option>
                            <option value="openSource">Open source consultancy session</option>
                            <option value="other">Other</option>
                        </select>
                        
                    </div>
                    <div>
                        <label htmlFor="comment">Your message</label>
                        <br/>
                        <textarea id="comment" name="comment" {...formik.getFieldProps("comment")} />

                        <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>
                    </div>
                    <Button type="submit" backgroundColor="#9885c6" color="white" width="full">
                    Login
                    </Button>
                </form>
                </Box>
            
                </VStack>
                </FullScreenSection>
            
    )
}

export default ContactMeSection
