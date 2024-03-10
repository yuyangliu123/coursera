import { useRef, useState } from "react"

const CreatingAFormComponentInReactUncontroll =()=>{
    const inputRef=useRef(null)
    const [inputValue,setInputValue]=useState("")
    const handleChange=(event)=>{
        event.preventDefault()
        setInputValue(String(inputRef.current.value))
    }
    return(
        <>
        <form>
            <fieldset>
                <div className="Field">
                    <label>Name:</label>
                    <input type="text" placeholder="Name" name="name" ref={inputRef}/>
                </div>
                <button type="submit" onClick={handleChange}>Submit</button>
                <p>{inputValue}</p>
            </fieldset>
        </form>
        </>
    )
}

export default CreatingAFormComponentInReactUncontroll