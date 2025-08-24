import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {v4 as uuidv4} from "uuid"
import Cookies from 'js-cookie';
const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials:"include"
});

const authLink = setContext((_, { headers }) => {
  // 從localStorage或其他存儲中獲取token
  const accessToken = localStorage.getItem('accessToken');
  // 返回帶有Authorization header的headers
  let csrf_token = Cookies.get('X-CSRF-Token');
  if (!csrf_token) {
    csrf_token = uuidv4();
    Cookies.set('X-CSRF-Token', csrf_token, { secure: true, sameSite: 'strict' });
  }
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
      "X-CSRF-Token": `${csrf_token}`
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;