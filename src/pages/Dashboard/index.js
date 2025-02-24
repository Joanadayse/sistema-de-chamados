import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"

export default function Dashboard(){
    const {logout}= useContext(AuthContext);

async function handleLogout(params) {
    await logout();
    
}

    return(
        <div>
            <h1>Pagina de Dashboard</h1>
            <button onClick={handleLogout}>sair da conta</button>
        </div>
    )
}