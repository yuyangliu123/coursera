import { VStack, Box, HStack } from "@chakra-ui/react";
import theme from "../theme";

const FullScreenSection = ({ children, backgroundColor, height, padding, ...props }) => {
  return (
    <VStack backgroundColor={backgroundColor}>
      <Box height={height} w="100%" padding={padding} maxWidth="calc(100% - 70px)" margin="auto">
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
