const Dialog =()=>{
    const   Button=({children,backgroundColor})=>{
        return<button style={{backgroundColor: backgroundColor}}>{children}</button>
    }

    const Alert=({children})=>{
        return(
            <>
            <div className="Overlay"></div>
            <div className="Alert"  style={{border:"1px solid black"}}>{children}</div>
            </>
        )
    }


    const DeleteButton=()=>{
        return <Button backgroundColor="red">Delete</Button>
    }
    return(
        <>
        <header>Little Lemon Restaurant</header>
        <Alert>
            <h4>Delete Account</h4>
            <DeleteButton/>
        </Alert>
        </>
    )

}
export default Dialog