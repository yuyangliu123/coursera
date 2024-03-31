
import {useState} from "react"
import { validateEmail } from "./hooks/utils"
const CreateaRegistrationForm=()=>{
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [password,setPassword]=useState({
        value: "",
        isTouched: false
    })
    const [role, setRole] = useState("role"); 

    const [PasswordErrorMessage, setErrorMessage]=useState("")
    const handleChange=(e)=>{
        e.preventDefault()
        if(e.target.value.length<8){
            setErrorMessage("Password should have at least 8 characters")
        }else{
            setErrorMessage("password long enough")
        }
        setPassword({...password, value: e.target.value})
    }

    const getIsFormValid = () => { 
        return ( 
          firstName && 
          validateEmail(email) && 
          password.value.length >= 8 && 
          role !== "role" 
        ); 
      }; 

      const clearForm=()=>{
        setFirstName("") 
        setLastName("")
        setEmail("")
        setPassword({
            value:"",
            isTouched:false
        })
        setRole("role")
      }

      const handleSubmit=(e)=>{
        e.preventDefault();
        alert("Account Created");
        clearForm()
      }


      const [email,setEmail]=useState({
        value:"",
        isTouched:false
    })
    const [EmailErrorMessage, setEmailMessage]=useState("")
    

    const handleEmail = (e) => {
        e.preventDefault()
            if (e.target.value.length<5) {
                setEmailMessage("Email is required")
            } else {
                setEmailMessage("")
            }
        setEmail({ ...email, value: e.target.value});
    };



    return(
        <form onSubmit={handleSubmit}>
            <fieldset>
                <h1>Sign Up</h1>
                <div className="Field">
                    <div>
                        <label>First name *</label>
                    </div>
                    <div>
                        <input type="text" value={firstName} placeholder="First name" onChange={(e)=>{setFirstName(e.target.value)}}></input>
                    </div>
                    
                </div>
                <div className="Field">
                    <div>
                        <label>Last name</label>
                    </div>
                    <div>
                        <input type="text" value={lastName} placeholder="Last name" onChange={e=>{setLastName(e.target.value)}}></input>
                    </div>
                </div>
                <div className="Field">
                    <div>
                        <label>Email address *</label>
                    </div>
                    <div>
                        <input type="email" value={email.value} placeholder="Email address" onChange={handleEmail}
                        onBlur={()=>{setEmail({...email,isTouched:true})}}></input>
                    </div>
                    <p>{EmailErrorMessage}</p>
                </div>
                <div className="Field">
                    <div>
                        <label>Password *</label>
                    </div>
                    <div>
                        <input type="password" value={password.value} placeholder="Passward" 
                        onChange={handleChange} 
                        onBlur={()=>{setPassword({...password,isTouched:true})}}
                        ></input>
                        <p>{PasswordErrorMessage}</p>
                    </div>
                </div>
                <div className="Field">
                    <div>
                        <label>Role *</label>
                    </div>
                    <div>
                        <select value={role} onChange={e=>setRole(e.target.value)}>
                            <option value="role">role</option>
                            <option value="individual">Individual</option> 
                            <option value="business">Business</option> 
                        </select>
                    </div>
                </div>
                <button type="submit" disabled={!getIsFormValid()}>Submit</button>
            </fieldset>
        </form>
    )
}

export default CreateaRegistrationForm