import React, { useRef } from "react"



const UseRefToAccessDOM=()=>{
    const focusInputRef=useRef(null) 

    const focusInput=()=>{
        focusInputRef.current.focus()
    }
    return(
        <>
        <h1>Using useRef to access underlying DOM</h1>
        <input ref={focusInputRef} type="text"/>
        <input type="button" onClick={focusInput} value="Focus input"/>
        </>
    )
}

export default UseRefToAccessDOM