import React from "react";
import style from "./Sidebar.module.css"
const Sidebar =(props)=>{
    return <h1 className={style["sidebar-h1"]}>Hello there Sidebar, {props.greeting}</h1>
}

export default Sidebar;