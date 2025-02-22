import { useContext, useState } from "react";
import logo from "../../assests/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

export default function SignUp() {
  const [nome,setNome]= useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, loadingAuth } = useContext(AuthContext);


async  function handleSubmit(e){
e.preventDefault();

if(nome !== '' && email !== '' && password !== ''){
await  signUp(email , password , nome);
}
  }


  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="logo" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Nova Conta</h1>
          <input
            type="text"
            placeholder="Seu Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="*****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">{loadingAuth ? 'Carregando...': 'Cadastrar'}</button>
        </form>
        <Link to="/"> Já possui uma conta? Faça Login</Link>
      </div>
    </div>
  );
}
