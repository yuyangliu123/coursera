import { useState } from "react"

const ToDo=(props)=>{
    return(
        <tr>
        <td>
            <label>{props.id}</label>
        </td>
        <td>
            <input/>
        </td>
        <td>
            <label>{props.createAt}</label>
        </td>
    </tr>
    )
    
}

const UsingKeysWithinListComponents=()=>{
    const [todos,setTodos]=useState([{
        id: "todo1",
        createAt: "18:00"
    },
    {
        id:"todo2",
        createAt:"20:30"
    }])

    const reverseOrder=()=>{
        setTodos([...todos].reverse())
    }

    return(
        <>
        <input type="button" onClick={reverseOrder} value={"Reverse"}></input>
        <table>
            <tbody>
                {todos.map((todo,index)=>(
                    <ToDo id={todo.id} createAt={todo.createAt}/>
                ))}
            </tbody>
        </table>
        
        </>
    )

}

export default UsingKeysWithinListComponents