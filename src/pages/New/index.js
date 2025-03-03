import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlayCircle } from "react-icons/fi";
import "./new.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConection";
import { collection, getDoc, getDocs, doc, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const listRef = collection(db, "custumers");

export default function New() {
  const { user } = useContext(AuthContext);
  const {id}=useParams();

  const [customers, setCustomers] = useState([]);
  const [loadCustomes, setLoadCustomer] = useState();
  const [complemento, setComplemento] = useState("");
  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");
  const [custumerSelected, setCustumerSelected] = useState(0);
  const [idCustomer, setIdCustomer ]= useState(false)

  useEffect(() => {
    async function loadCustomes(params) {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
            });
          });

          if (snapshot.docs.size === 0) {
            console.log("NENHUMA EMPRESA CADASTRADA !");
            setCustomers([{ id: "1", nomeFantasia: "FREELA" }]);
            setLoadCustomer(false);
            return;
          }

          setCustomers(lista);
          setLoadCustomer(false);

          if(id){
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log("ERROR AO BUSCAR OS CLIENTES", error);
          setLoadCustomer(false);
          setCustomers([{ id: "1", nomeFantasia: "FREELA" }]);
        });
    }

    loadCustomes();
  },[id]);

  async function loadId(lista) {
    const docRef= doc(db, "chamados",id)
    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento)

        // buscando na lista se tem algum cliente igual ao que foi buscado
        let index=lista.findIndex(item=> item.id === snapshot.data().clienteId)
        setCustumerSelected(index)
        setIdCustomer(true)
      })
      .catch((error) => {
        console.log(error);
        setIdCustomer(false)
      });
    
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  function handleChangeCustumer(e) {
    setCustumerSelected(e.target.value);
  }

  async function handleRegister(e){
    e.preventDefault();

    if(idCustomer){
      alert("Editando chamado")
      return;
    }

    // Registrar chamado

    await addDoc(collection(db,"chamados"),{
        created: new Date(),
        cliente: customers[custumerSelected].nomeFantasia,
        clienteId: customers[custumerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId:user.uid,

    })
    .then(()=>{
        toast.success("Chamado registrado!")
        setComplemento("")
        setCustumerSelected(0)
        
    })
    .catch((e)=>{
        toast.error("Ops erro ao registrar!")
    })

  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Novo chamado">
          <FiPlayCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Clientes</label>
            {loadCustomes ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : (
              <select value={custumerSelected} onChange={handleChangeCustumer}>
                {customers.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Progresso</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <span>Em aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              />
              <span>Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === "Atendido"}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
