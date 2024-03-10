import {useState } from "react"

const CreatingAFormComponentInReactControll =()=>{
    const [inputValue,setInputValue]=useState("")
    const handleChange=(event)=>{
        setInputValue(event.target.value) // 更新 inputValue 的值
    }
    return(
        <>
        <form>
            <fieldset>
                <div className="Field">
                    <label>Name:</label>
                    <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
                </div>
                <button disabled={!inputValue} type="submit">Submit</button> 
                {/* 當 inputValue 為空時，button 會被禁用 */}
                <p>{inputValue}</p>
            </fieldset>
        </form>
        </>
    )
}

export default CreatingAFormComponentInReactControll