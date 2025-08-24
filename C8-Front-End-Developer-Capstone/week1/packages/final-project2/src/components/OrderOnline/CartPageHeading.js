import { Box } from "@chakra-ui/react"

const CartPageHeading=({numItem})=>{
    return(
        <>
        {(()=>{
            switch (numItem) {
            case 1:
                return <Box textStyle="StyledH2" color="#000000">Your Cart ({numItem} item)</Box>
            default:
                return <Box textStyle="StyledH2" color="#000000">Your Cart ({numItem} items)</Box>
        }
        })()}
        </>
    )
    
}

export default CartPageHeading