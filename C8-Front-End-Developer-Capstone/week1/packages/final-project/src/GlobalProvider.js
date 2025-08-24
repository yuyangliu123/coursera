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
import { FormProvider, useForm } from 'react-hook-form';
import { checkoutFormConfig } from './components/CheckoutPage/config/checkoutFormConfig';
import { CapslockProvider } from './components/provider/CheckCapslock';
import { CartPageContextProvider} from './components/OrderOnline/CartPage/CartPageContext';

const GlobalProvider = ({ children }) => {
    const methods = useForm(checkoutFormConfig)
    return (
        <TokenRotateProvider>
            <ChakraProvider theme={theme}>
                <MealContextProvider>
                    <ModalContextProvider>
                        <GlobalContextProvider>
                            <SearchContextProvider>
                                <CapslockProvider>
                                    <ApolloProvider client={client}>
                                        <CartPageContextProvider>
                                            <ProductProvider>
                                                <FormProvider {...methods}>
                                                    {children}
                                                </FormProvider>
                                            </ProductProvider>
                                        </CartPageContextProvider>
                                    </ApolloProvider>
                                </CapslockProvider>
                            </SearchContextProvider>
                        </GlobalContextProvider>
                    </ModalContextProvider>
                </MealContextProvider>
            </ChakraProvider>
        </TokenRotateProvider>
    )
}

export default GlobalProvider