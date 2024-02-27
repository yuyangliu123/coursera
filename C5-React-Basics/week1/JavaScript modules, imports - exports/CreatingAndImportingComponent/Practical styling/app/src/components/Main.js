import React from "react"

const Main =(props)=>{
    return(
        <main>
            <h1>Hello, {props.name}</h1>
            <h2>You are in position no.{props.num}</h2>
        </main>
    )
}

export default Main;