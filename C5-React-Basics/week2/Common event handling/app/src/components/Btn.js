import {useState} from "react"

const Btn =()=>{
    const clickHandler =() => console.log("clicked")

    const [num, setNum]=useState(1)
    const clickHandler1 =() => {
        setNum(num + 1)
    }
    const [num1, setNum1]=useState(1)
    const holdHandler =() => {
        setNum1(num1 + 1)
    }

    const [num2, setNum2]=useState(1)
    const holdHandler1 =() => {
        setNum2(num2 + 1)
    }
    

    return(
        
        <div style={{backgroundColor: "red"}} onMouseOver={holdHandler1}>
        <button onClick={clickHandler}>Click me</button>
        
        <input type="button" value={"Click me1"} onClick={clickHandler1}></input>
        <h1>{num}</h1>
        <input type="button" value={"Hold me"} onMouseOver={holdHandler}></input>
        {num2}
        <h2>{num1}</h2>

        </div>

        
    )
}

export default Btn

