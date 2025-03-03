import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import "./dashboard.css";
import Title from "../../components/Title";
import { FiPlus, FiMessageSquare , FiSearch, FiEdit2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { db } from "../../services/firebaseConection";
import { format } from "date-fns";


const listRef= collection(db,"chamados");


export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados]= useState([]);
  const [loading , setLoading]= useState(true);
  const [isEmpty, setIsEmpty]= useState(false);
  const [lastDocs, setLastDocs]=useState();
  const [loadingMore, setLoadingMore]= useState(false);

  useEffect(()=>{
   async function loadChamados(params) {

    const q = query(listRef, orderBy("created", "desc"), limit(5));
    const querySnapshot = await getDocs(q)
    // para não ocasionar a duplicidade -React.StrictMode- em desenvolvimento;
    setChamados([]) 

    // buscar chamados
    await updateState(querySnapshot)
    setLoading(false);
    
   }

   loadChamados();

   return()=>{}
  }, []);


// manipular a lista e colocar dentro do usestate , percorre a lista de chamados;
  async function updateState(querySnapshot) {
    const isCollectionEmpty= querySnapshot.size===0;
    if(!isCollectionEmpty){
      let lista =[];
      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto:doc.data().assunto,
          cliente:doc.data().cliente,
          clienteId:doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status:doc.data().status,
          complemento: doc.data().complemento,

        })
      });

      // pegando o ultimo item
const lastDocs= querySnapshot.docs[querySnapshot.docs.length -1];

// pegando a lista de chamados e acrescentando mais
      setChamados(chamados=>[...chamados, ...lista])

      setLastDocs(lastDocs);
    }else{
      setIsEmpty(true);

    }

    setLoadingMore(false);
    
  }

    async function handleMore (){
   setLoadingMore(true)

    const q = query(listRef, orderBy("created", "desc"),startAfter(lastDocs), limit(5));
    const querySnapshot=await getDocs(q)
    await updateState(querySnapshot);
    }

  // antes de buscar os chamados - setLoading(true), ele renderiza "Buscando chamados..." , apos carregar todos os chamados  setLoading(false) , renderiza toda a tabela com os chamados;

  if(loading){
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    );
  }




 
  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {/* <Link to="/new" className="new">
            <FiPlus color="#fff" size={25} />
            Novo Chamado
          </Link> */}

          {/* renderização condicional para se não houver chamados e caso haouver renderizar a tabela  */}

          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlus color="#fff" size={25} />
                Novo Chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#fff" size={25} />
                Novo Chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status </th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>

                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Clientes">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span
                            className="badge"
                            style={{ backgroundColor: item.status ==="Aberto" ? "#5cb85c" : "#999" }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#">
                          <button
                            className="action"
                            style={{ backgroundColor: "#3583f6" }}
                          >
                            <FiSearch color="#fff" size={17} />
                          </button>

                          <Link
                          to={`/new/${item.id}`}
                            className="action"
                            style={{ backgroundColor: "#f6a935" }}
                          >
                            <FiEdit2 color="#fff" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* se ele estiver true , mostre o h3 , senão noa mostra a linha */}
              {loadingMore && <h3>Buscando mais chamados...</h3>}
              {!loadingMore && !isEmpty && (
                <button onClick={handleMore} className="btn-more">Buscar mais</button>
              )}
            </>
          )}
        </>
      </div>

      {/* <button onClick={handleLogout}>sair da conta</button> */}
    </div>
  );
}
