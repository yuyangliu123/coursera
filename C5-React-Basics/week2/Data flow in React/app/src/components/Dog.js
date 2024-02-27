import Puppy from "./Puppy";
const Dog=(props)=>{
    return (
        <>
        <Puppy name="Max" bowlShape="square" bowlStatus="full" />
        <h1>Now is : {props.now}</h1>
        </>
            );
}

export default Dog