
import styled from "styled-components";
import Card from "./Card";
import { Box, Grid } from "@chakra-ui/react";



const Project=styled.div`
background-color:green;
padding:2% 0;
  .row{
    margin:0 2em;
  }
    .container{
        margin-left:auto;
        margin-right:auto;
        h1{
            color:white;
            margin:0 0 0 1%
        }
    }
`

const projects=[
    {
        title: "React Space",
        description:
        "Handy tool belt to create amazing AR components in a React app, with redux integration via middleware️",
        getImageSrc:()=>require("./image/photo1.jpg"),
    },
    {
        title: "React Infinite Scroll",
        description:
          "A scrollable bottom sheet with virtualisation support, native animations at 60 FPS and fully implemented in JS land 🔥️",
        getImageSrc: () => require("./image/photo2.jpg"),
      },
      {
        title: "Photo Gallery",
        description:
          "A One-stop shop for photographers to share and monetize their photos, allowing them to have a second source of income",
        getImageSrc: () => require("./image/photo3.jpg"),
      },
      {
        title: "Event planner",
        description:
          "A mobile application for leisure seekers to discover unique events and activities in their city with a few taps",
        getImageSrc: () => require("./image/photo4.jpg"),
      },
]

const ProjectsSection =()=>{
    return(
        <Project>
          <div className="row">
            <div className="container">
                <h1>Featured Projects</h1>
            </div>
            <Grid display="grid" templateColumns="repeat(2,1fr)">
                {projects.map((project)=>(
                    <Card imageSrc={project.getImageSrc()}  title={project.title} description={project.description}></Card>
                ))}
            </Grid>
          </div>
            
            
            
        </Project>
    )
}

export default ProjectsSection