import { useState,useRef } from "react";

//Uncontrolled Inputs
const ControlledVSUncontrolled =()=>{
    const inputRef = useRef(null); 

 const handleSubmit = (event) => { 
    event.preventDefault()
   const inputValue = Number(inputRef.current.value); 
   console.log(inputValue+1)
 } 


 //Controlled Inputs
 const [value, setValue] = useState(""); 

 const handleChange = (e) => { 
   setValue(e.target.value) 
 } 

 return ( 
    <>
    <h1>Uncontrolled Inputs</h1>
    <form onSubmit={handleSubmit}> 
        <input ref={inputRef} type="text" /> 
        <button type="submit">Submit</button>
    </form> 

    <h1>Controlled Inputs</h1>
    <form> 
     <input 
       value={value} 
       onChange={handleChange} 
       type="text" 
     /> 
   </form> 
    </>
    
 ); 
}

export default ControlledVSUncontrolled