import React, { useState } from "react"

const GoalForm=(props)=>{
    const [formData,setFormData]=useState({goal:"",by:""})

    const changeHadler=(e)=>{
        return setFormData({...formData, [e.target.name]:e.target.value})
    }
    const submitHandler=(e)=>{
        e.preventDefault();
        props.onAdd(formData)
        setFormData({goal: "",by:""})
    }

    return(
        <>
            <h1>My Little Lemon Goals</h1>
            <form onSubmit={submitHandler}>
                <input type="text" name="goal" value={formData.goal} placeholder="Goal" onChange={changeHadler}/>
                <input type="text" name="by" value={formData.by} placeholder="By..." onChange={changeHadler}/>
                <button type="submit">Submit Goal</button>
            </form>
        </>
    )
}

const ListOfGoals=(props)=>{
    return(
        <ul>
            {props.allGoals.map((e)=>(
                <li key={e.goal}>
                    <span>My goal is to {e.goal}, by {e.by}</span>
                </li>
            ))}
        </ul>
    )
}


const UsingTheuseStateHook=()=>{
    const [allGoals,updateAllGoals]=useState([])

    const addGoal=(goal)=>{
        return updateAllGoals([...allGoals,goal])
    }

    return(
        <>
        <GoalForm onAdd={addGoal}/>
        <ListOfGoals allGoals={allGoals}/>
        </>
    )

}

export default UsingTheuseStateHook