import './App.css'
import { ChakraProvider } from "@chakra-ui/react"
import theme from './theme';
import { TokenRotateProvider } from './components/provider/JwtTokenRotate';
import { MealContextProvider } from './components/provider/MealContext';
import client from './components/provider/apollo-client';
import { ModalContextProvider } from './components/provider/ModalContext';
import { GlobalContextProvider } from './components/provider/GlobalModalContext';
import { ApolloProvider } from '@apollo/client';
import { SearchContextProvider } from './components/provider/SearchContext';
import { ProductProvider } from './components/OrderOnline/ProductContext';

const GlobalProvider = ({ children }) => {
    return (
        <TokenRotateProvider>
            <ChakraProvider theme={theme}>
                <MealContextProvider>
                    <ModalContextProvider>
                        <GlobalContextProvider>
                            <SearchContextProvider>
                                <ApolloProvider client={client}>
                                    <ProductProvider>
                                        {children}
                                    </ProductProvider>
                                </ApolloProvider>
                            </SearchContextProvider>
                        </GlobalContextProvider>
                    </ModalContextProvider>
                </MealContextProvider>
            </ChakraProvider>
        </TokenRotateProvider>
    )
}

export default GlobalProvider