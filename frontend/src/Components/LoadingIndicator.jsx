import { Image } from "@chakra-ui/react"
import loading from "../Assets/loading_indicator.gif"
const LoadingIndicator = () => {
    return <div style={{ height: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }} >
        <Image src={loading} w={["25vw", "25vw", "15vw", "15vw", "10vw"]} marginBottom={"10vh"} />
    </div >
}
export default LoadingIndicator;