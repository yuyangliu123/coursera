import { useFormik, yupToFormErrors } from "formik";
import styled from "styled-components";
import useSubmit from "../components/hooks/useSubmit"
import { useEffect, useState } from "react";
import { validateEmail } from "../components/hooks/utils"
import { useAlertContext } from "./alertContext";
import { border } from "@chakra-ui/react";
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

const ContactMeSection2 = () => {
    
    const { isLoading, response, submit }=useSubmit()

    const [firstName,setfirstName]=useState({
        value:"",
        isTouched:false
    })
    const [NameErrorMessage, setNameMessage]=useState("")
    const handleName = (e) => {
        e.preventDefault()
        const value = e.target.value;
        setfirstName({ ...firstName, value: e.target.value,isTouched:true});
        setNameMessage(value ? "" : "Require");
    };

    const [email,setEmail]=useState({
        value:"",
        isTouched:false
    })
    const [EmailErrorMessage, setEmailMessage]=useState("")
    const handleEmail = (e) => {
        e.preventDefault()
        const value = e.target.value;
        setEmail({ ...email, value: e.target.value,isTouched:true});
        if (!value) {
            setEmailMessage("Require")
        } else if(!validateEmail(value)) {
            setEmailMessage("Invalide Email")
        } else {
            setEmailMessage("")
        }
    };

    const [comment,setComment]=useState({
        value:"",
        isTouched:false
    })
    const [CommentErrorMessage, setCommentMessage]=useState("")
    const handleComment = (e) => {
        e.preventDefault()
        const value = e.target.value;
        setComment({ ...comment, value: e.target.value,isTouched:true});
        if (!value) {
            setCommentMessage("Require")
        } else if(value.length<25) {
            setCommentMessage("Must be at least 25 characters")
        } else {
            setCommentMessage("")
        }
    };


    const { onOpen } = useAlertContext();

    const getIsFormValid = () => { 
        return ( 
          firstName && 
          validateEmail(email) && 
          comment.length>25 
        ); 
      }; 

    const clearForm=()=>{
        setEmail("")
      }

      const handleSubmit=(e)=>{
        e.preventDefault();
        alert("Account Created");
        clearForm()
      }
    



    return (
        <Contact>
            <div className="container">
                <h1>Contact me</h1>
                <form onSubmit={handleSubmit}>
                    <div className="firstName">
                        <label htmlFor="firstName">Name</label>
                        <br/>
                        <input type="text" 
                        id="firstName" 
                        name="firstName"
                        value={firstName.value}
                        placeholder="Name"
                        onChange={handleName}
                        onBlur={handleName}
                        style={firstName.isTouched && NameErrorMessage?{
                            border: '2px solid red'}:null}
                        />
                        <p style={firstName.isTouched && NameErrorMessage ? {
                             color: 'red', fontWeight: 'bold' } : null}>
                            {NameErrorMessage}
                        </p>
                    </div>
                    <div className="Field">
                        <div>
                            <label>Email address *</label>
                        </div>
                        <div>
                            <input type="email" 
                            value={email.value} 
                            placeholder="Email address" 
                            onChange={handleEmail}
                            onBlur={handleEmail}
                            style={email.isTouched && EmailErrorMessage?{
                                border:'2px solid red'}:null}>
                            </input>
                        </div>
                        <p style={email.isTouched && EmailErrorMessage ? {
                                color: 'red', fontWeight: 'bold' } : null}>
                            {EmailErrorMessage}
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
                        value={comment.value}
                        onChange={handleComment}
                        onBlur={handleComment}
                        style={comment.isTouched && CommentErrorMessage?{
                            border:'2px solid red'}:null}/>
                        <p style={comment.isTouched && CommentErrorMessage ? {
                                color: 'red', fontWeight: 'bold' } : null}>
                            {CommentErrorMessage}
                        </p>
                    </div>
                    <button type="submit" name="submit">Submit</button>
                </form>
            </div>
        </Contact>
    )
}

export default ContactMeSection2
