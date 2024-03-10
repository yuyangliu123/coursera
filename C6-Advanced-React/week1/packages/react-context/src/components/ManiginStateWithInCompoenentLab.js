import { useState } from "react"


const SpendGiftCard=()=>{
    const [giftCard, setGiftCard]=useState({
        recipient: "Jennifer Smith",
        text: "Free dinner for 4 guests",
        value: true,
        instructions: "To use your coupon, click the button below."
    })
    const useCard=()=>{
        setGiftCard((preState)=>{
            return{...preState,
                text: "Your coupon has been used.",
                value: false,
                instructions:"Please visit our restaurant to renew your gift card."
            }})
    }
    

    return (
        <>
        <div>
          <h1>Gift Card Page</h1>
          <p>Customer: {giftCard.recipient}</p>
          <p>{giftCard.text}</p>
          <p>{giftCard.instructions}</p>
          {giftCard.value && (
            <button onClick={useCard}>Spend Gift Card</button>
          )}
        </div>
        </>
    )


    
}

const ManiginStateWithInCompoenentLab=()=>{
    return (
        <SpendGiftCard/>
    )
}

export default ManiginStateWithInCompoenentLab
