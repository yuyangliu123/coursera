import { VStack, Box, HStack } from "@chakra-ui/react";
import theme from "../theme";

const FullScreenSection = ({ children, backgroundColor, height, minHeight, padding, position,bottom, ...props }) => {
  return (
    <VStack backgroundColor={backgroundColor} position={position} bottom={bottom}>
      <Box height={height} minHeight={minHeight} w="100%" padding={padding} maxWidth="calc(100% - 40px)" margin="0 auto"  {...props}>
        <VStack layerStyle="inside">
          <HStack w="100%" justifyContent="space-between">
            {children}
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default FullScreenSection;
