import styled from "styled-components";
import {VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
const StyledCard=styled.div`

    .card{
        
        max-width:95%;
        max-heigh:95%;
        background-color:white;
        margin: 1em auto;
        border-radius: 10px;
        padding-bottom:10px;

        img{
            border-radius: 10px;
            width:100%;
            object-fit: cover;
        }
        div{
            width:95%;
        }
        .description{
            color:#696969;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* number of lines to show */
            -webkit-box-orient: vertical;
            height:5em;
        }
        a{
            text-decoration:none;
            color:black
        }
    }
    
`


const Card=({imageSrc,title,description})=>{
    return(
        <StyledCard>
            <VStack className="card" spacing={0}>
                <img src={imageSrc}></img>
                <div>
                    <h3>{title}</h3>
                </div>
                <div className="description">
                    <p>{description}</p>
                </div>
                <div>
                    <a href="#"><strong>See more <FontAwesomeIcon icon={faArrowRight} size="1x" /></strong></a>
                </div>
            </VStack>
        </StyledCard>
    )
}

export default Card