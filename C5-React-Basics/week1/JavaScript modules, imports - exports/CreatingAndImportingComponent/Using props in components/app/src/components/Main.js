import React from "react";
import style from "./Main.module.css"

const Main =(props)=>{
    return <h1 className={style["main-h1"]}>Hello from Main,{props.greeting}</h1>
}

export default Main;