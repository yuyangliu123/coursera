import styled from "styled-components"

const FixNav=({children})=>{

    const Nav=styled.div`
    position:fixed;
    top:0;
    width:100%;
    z-index:50;
    `

    return(
        <Nav>
            {children}
        </Nav>
    )
}

export default FixNav