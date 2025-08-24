import { Box } from "@chakra-ui/react"

const StickyNav = ({ children }) => {
    return (
        <Box position="sticky" top="0" zIndex="200">
            {children}
        </Box>
    )
}

export default StickyNav