import { useToast } from "@chakra-ui/react"

export const showToast=(message,statue,duration)=>{
    const toast=useToast()
    return toast({ title: message, status: statue, duration: duration });

}