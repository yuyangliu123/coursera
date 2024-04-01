import styled from "styled-components";

const Container = styled.div`
  background-color: #2A4365;   
  display: flex;
  justify-content: center;
  align-items: center;
  padding:10em 0;
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
            p, h1 {
            color: white;
            }
            img{
                width:100px;
                border-radius:50%
                
            }
    }  
`;

const LandingSection = (e) => {
  const greeting = "Hello, I am Pete!";
  const bio1 = "A frontend developer";
  const bio2 = "specialised in React";

  return (
    <Container>
      <div className="container">
        <img src="https://i.pravatar.cc/150?img=7" alt="Avatar" />
        <p>{greeting}</p>
        <h1>{bio1}</h1>
        <h1>{bio2}</h1>
      </div>
    </Container>
  );
}

export default LandingSection