import { useState } from "react"

const CreateaControlledFormComponent=()=>{
    const [score, setScore]=useState("10")
    const[comment,setComment]=useState("")
    const handleSubmit=(e)=>{
        e.preventDefault()
        if(score<=5 && comment.length<=10){
            alert("Please provide a comment explaining why the experence was poor");
            return
        }
        console.log("Form submitted");
        setComment("")
        setScore("10")
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            <fieldset>
                <h2>Feedback form</h2>
                <div className="Field">
                    <label>Score: {score}★</label>
                    <br></br>
                    <input type="range" min="0" max="10" value={score} onChange={e=>setScore(e.target.value)}></input>
                </div>
                <div className="Field">
                    <label>Comment: </label>
                    <textarea value={comment} onChange={e=>setComment(e.target.value)} />
                </div>
                <button type="submit">Submit</button>
            </fieldset>
        </form>
        
        </>
    )

}

export default CreateaControlledFormComponent