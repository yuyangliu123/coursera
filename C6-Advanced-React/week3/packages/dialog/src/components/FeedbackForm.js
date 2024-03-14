import { useState } from "react"

const FeedbackForm=({onSubmit})=>{
    const [score,setScore]=useState("10")
    const [comment,setComment]=useState("")
    const isDisable=()=>{
        return(
            Number(score)<5 &&comment.length<=10
        )
    }
    const textAreaPlaceHolder=isDisable()
    ?"Please provide a comment explain why the experience was not good"
    :"Optional feedback"
    const handleSubmit=(e)=>{
        e.preventDefault();
        onSubmit({score,comment})
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
        <h1>Feedback Form</h1>
        <label htmlFor="score">Score: {score}</label>
        <br/>
        <input 
        id="score"
        value={score}
        onChange={(e)=>{setScore(e.target.value)}}
        type="range"
        min="0"
        max="10"/>
        <br/>
        <label htmlFor="comment">Comments:</label>
        <br/>
        <textarea 
        id="comment"
        name="comment"
        placeholder={textAreaPlaceHolder}
        value={comment}
        onChange={(e)=>setComment(e.target.value)}/>
        <br/>
        <button type="submit" disabled={isDisable()}>Submit</button>
        </form>
        
        
        </>
    )

}

export default FeedbackForm