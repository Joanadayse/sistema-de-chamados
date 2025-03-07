import { useContext } from "react";
import "./header.css";

import avatar from "../../assests/avatar.png";
import { Link} from "react-router-dom";

import { AuthContext } from "../../contexts/auth";
import { FiHome, FiSettings, FiUser } from "react-icons/fi";

export default function Header() {
  const { user } = useContext(AuthContext);
  // console.log("Usuário carregado:", user);

  return (
    <div className="sidebar">
      <div>
        <img
          src={user?.avatarUrl ? user.avatarUrl : avatar}
          alt="Foto do usuário"
        />
      </div>

      <Link to="/dashboard">
        <FiHome color="#fff" size={24} />
        Chamador
      </Link>

      <Link to="/custumers">
        <FiUser color="#fff" size={24} />
        Clientes
      </Link>

      <Link to="/profile">
        <FiSettings color="#fff" size={24} />
        Perfil
      </Link>
    </div>
  );
}
