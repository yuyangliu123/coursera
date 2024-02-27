import React from "react"

const Btn=()=>{
    const handleClick=()=>{
        let randomNum=Math.floor(Math.random()*3)+1
        console.log(randomNum);
        let userInput = prompt('type a number');
        alert(`Computer number: ${randomNum}, Your guess: ${userInput}`)
    }


    return(
        <>
        <input type="button" value={"Guess the number between 1 and 3"} onClick={handleClick}></input>
        </>
        
    )

    
}

export default Btn