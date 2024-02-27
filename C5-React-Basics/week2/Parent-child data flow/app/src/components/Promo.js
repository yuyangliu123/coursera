import React from "react"
import PromoHeading from "./PromoHeading"
import Sidebar from "./Sidebar.js"
import Footer from "./Footer"

//Promo =>Parent component//
//PromoHeading => Child component//
//如果不使用Parent Child 那每次更改Child的內容 需手動到每個Child中更新<h1>
const data={
    heading: "80% off all item",
    callToAction: "Everything must go!"
}


const Promo =()=>{  
    return(
        <>
        <PromoHeading 
        heading={data.heading}
        callToAction={data.callToAction}
        /> 
        <Sidebar 
        heading={data.heading}
        callToAction={data.callToAction}/>
        <Footer
        heading={data.heading}
        callToAction={data.callToAction}
        />
        </>
    )
}

export default Promo