import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"
import Header from "../../components/Header";

export default function Dashboard(){
    const {logout}= useContext(AuthContext);

async function handleLogout(params) {
    await logout();
    
}

    return(
        <div>
            <Header/>
            <h1>Pagina de Dashboard</h1>
            <button onClick={handleLogout}>sair da conta</button>
        </div>
    )
}