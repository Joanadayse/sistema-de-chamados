import { FiSettings } from "react-icons/fi"
import Header from "../../components/Header"
import Title from "../../components/Title"

export default function Profile(){
    return (
        <div>
            <Header/>
            <div className="content">
                <Title name="Minha conta"> 
        <FiSettings size={25}/>
                </Title>
            </div>
            <h1>Profile</h1>
        </div>
    )
}