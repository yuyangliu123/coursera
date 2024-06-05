import { gql, useQuery } from '@apollo/client';
import { useUserRotate } from './components/provider/JwtTokenRotate';

const HELLO_QUERY = gql`
query Shoppingcarts($email: String) {
    shoppingcarts(email: $email) {
      totalItem
      data {
        strMealThumb
        strMeal
        numMeal
        baseAmount
      }
      totalAmount
    }
  }
`


export default function Hello() {
    const {email}=useUserRotate()
    console.time("HELLO_QUERY Time");
    const { data, loading, error } = useQuery(HELLO_QUERY,{
        variables: {email:email},
    });
    console.timeEnd("HELLO_QUERY Time");
    if (loading) return <p>Loading...</p>;
    if (error) {
        console.error('HELLO_QUERY error', error);
        return <p>Error!</p>;
    }

    if (!data || !data.shoppingcarts[0]) {
        return <p>No data found</p>;
    }

    return(
    <div>
        <p>email : {data.shoppingcarts[0].email}</p>
        <p>totalItem: {data.shoppingcarts[0].totalItem}</p>
    </div>);
}
