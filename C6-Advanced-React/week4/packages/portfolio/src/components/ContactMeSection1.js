import { useFormik, yupToFormErrors } from "formik";
import styled from "styled-components";
import useSubmit from "../components/hooks/useSubmit"
import { useEffect, useState } from "react";
import { validateEmail } from "../components/hooks/utils"
import { useAlertContext } from "./alertContext";
import { useToast } from "@chakra-ui/react";
//當你使用 styled-components 來創建一個新的 component 時，每次該 component 重新渲染，都會生成一個新的實例。這可能導致你的 input 欄位失去焦點，因為它被一個新的實例替換了。

//解決這個問題的一種方法是將 styled component 移出你的 component，這樣它就只會創建一次，而不是在每次渲染時都創建新的實例
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
            display: block;
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

const ContactMeSection1 = () => {
    
    const { isLoading, response, submit }=useSubmit()

    const initialValues = {
        firstName: '',
        email: '',
        type: '',
        comment: ''
      };

      const [values, setValues] = useState(initialValues);
      const [errors, setErrors] = useState({});
      const [touched, setTouched] = useState({});
    

      const handleChange = (event) => {
        setValues({
          ...values,
          [event.target.name]: event.target.value
        });
        setTouched({
          ...touched,
          [event.target.name]: true
        });
    
        // 驗證 firstName
        const name=event.target.name
        const value=event.target.value
        if (name === 'firstName') {
          if (!value) {
            setErrors({ ...errors, firstName: 'Required' });
          } else {
            setErrors({ ...errors, firstName: '' });
          }
           // 驗證 email
        } else if(name==="email"){
            if(!value){
                setErrors({ ...errors, email: 'Required' })
            }else if(!validateEmail(value)) {
                setErrors({ ...errors, email: "Invalide Email" })
            } else {
                setErrors({ ...errors, email: "" })
            }
            //驗證comment
        }else if(name==="comment"){
            if(!value){
                setErrors({ ...errors, comment: 'Required' })
            }else if(value.length<25) {
                setErrors({ ...errors, comment: "Must be at least 25 characters" })
            } else {
                setErrors({ ...errors, comment: "" })
            }}
    };


    const handleBlur = (event) => {
        setTouched({
          ...touched,
          [event.target.name]: true
        });
    
        // 驗證 firstName
        const name=event.target.name
        const value=event.target.value
        if (name === 'firstName') {
          if (!value) {
            setErrors({ ...errors, firstName: 'Required' });
          } else {
            setErrors({ ...errors, firstName: '' });
          }
           // 驗證 email
        } else if(name==="email"){
            if(!value){
                setErrors({ ...errors, email: 'Required' })
            }else if(!validateEmail(value)) {
                setErrors({ ...errors, email: "Invalide Email" })
            } else {
                setErrors({ ...errors, email: "" })
            }
            //驗證comment
        }else if(name==="comment"){
            if(!value){
                setErrors({ ...errors, comment: 'Required' })
            }else if(value.length<25) {
                setErrors({ ...errors, comment: "Must be at least 25 characters" })
            } else {
                setErrors({ ...errors, comment: "" })
            }}
    };
    




      

    


    
/*
    const getIsFormValid = () => { 
        return ( 
          values.firstName && 
          validateEmail(email) && 
          comment.length>25 
        ); 
      }; 
*/
    const clearForm=()=>{
        setValues({
            firstName: '',
            email: '',
            type: '',
            comment: ''
          })
          setTouched({})
          setErrors({})
      }

      const getIsFormValid = () => { 
        return ( 
          values.firstName && 
          values.email&&
          validateEmail(values.email) && 
          values.comment.length>25 
        ); 
      };
      
      const toast=useToast()
      const handleSubmit = (e) => {
        console.log("submit");
        e.preventDefault();
        if (getIsFormValid()) {
            toast({
                title: "Success",
                description: "Data uploaded to the server. Fire on!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            clearForm();
        } else {
            toast({
                title: "Error",
                description: "There was an error processing your request",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };    

    return (
        <Contact>
            <div className="container">
                <h1>Contact me</h1>
                <form   onSubmit={handleSubmit}>
                    <div className="firstName">
                        <label htmlFor="firstName">Name</label>
                        <br/>
                        <input type="text" 
                        id="firstName" 
                        name="firstName"
                        value={values.firstName}
                        placeholder="Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={(!values.firstName && touched.firstName) ? {
                            border: '2px solid red'} : null}
                        />
                        <p style={errors.firstName && touched.firstName ? {
                            color: 'red', fontWeight: 'bold' } : null}>
                            {errors.firstName}
                        </p>
                    </div>
                    <div className="Field">
                        <div>
                            <label>Email address *</label>
                        </div>
                        <div>
                            <input type="email" 
                            id="email" 
                            name="email"
                            value={values.email}
                            placeholder="Email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={(!validateEmail(values.email) && touched.email) ? {
                                border: '2px solid red'} : null}
                            />

                            
                        </div>
                        <p style={(!validateEmail(values.email) && touched.email) ? {
                                color: 'red', fontWeight: 'bold' } : null}>
                            {errors.email}
                        </p>
                    </div>
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
                        <textarea 
                        id="comment" 
                        name="comment" 
                        value={values.comment}
                        onChange={handleChange}
                        onBlur={handleChange}
                        style={errors.comment && touched.comment?{
                            border:'2px solid red'}:null}/>
                        <p style={errors.comment && touched.comment ? {
                                color: 'red', fontWeight: 'bold' } : null}>
                            {errors.comment}
                        </p>
                    </div>
                    <button type="submit" name="submit">Submit</button>
                </form>
            </div>
        </Contact>
    )
}

export default ContactMeSection1
