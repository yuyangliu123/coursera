import React from "react";
import style from "./Header.module.css"
const Header=(props)=> {
    console.log(props)  
  return <h1 className={style['header-h1']}>Hello from Header, {props.name}, {props.color}</h1>
}


export default Header;