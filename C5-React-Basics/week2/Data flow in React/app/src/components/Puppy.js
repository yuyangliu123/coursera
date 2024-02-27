import Bowl from "./Bowl";

const Puppy=(props)=>{
    return (
        <div>
            {props.name} has <Bowl bowlShape="square" bowlStatus="full" />
        </div>
    );
}

export default Puppy 