import React from "react"

const Sidebar =()=>{
    const asideStyle={
        background:"azure",
        width:"calc(30% - 10px)",
        margin:"10px"
    }

    return(
        <aside 
        style={asideStyle}
        className="sidebarComponent">
            <h3>Sidebar content here</h3>
        </aside>
    )
}

export default Sidebar;