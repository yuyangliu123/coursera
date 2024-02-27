import React from "react"
import {useState} from "react"

const ModeToggler=()=>{
    
    const [darkModeOn, setdarkMode]=useState(false)
    const darkMode =<h1>Dark Mode is On</h1>
    const lightMode =<h1>Light Mode is On</h1>
    

    const handleClick=()=>{
        setdarkMode(!darkModeOn);
        darkModeOn? console.log("Dark Mode is On") : console.log("Light Mode is On");
    }

    

    return(
        <div>
            {darkModeOn? darkMode : lightMode}
            <input type="button" onClick={handleClick} value={"change"}>
            </input>
        </div>
    )

}

export default ModeToggler