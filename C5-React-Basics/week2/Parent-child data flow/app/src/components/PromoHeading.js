import React from "react"

const PromoHeading =(props)=>{
    return(
        <>
        <h1>{props.heading}</h1>
        <h2>{props.callToAction}</h2>
        </>
    )

}

export default PromoHeading