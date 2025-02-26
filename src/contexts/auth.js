import { createContext,  useEffect, useState } from "react";
import { auth,db} from "../services/firebaseConection";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc,getDoc, setDoc } from "firebase/firestore";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext= createContext({})

function AuthProvider({children}){
    const [user , setUser]= useState(null);
    const[loadingAuth,setLoadingAuth]= useState(false);
    const[loading, setLoading]= useState(true);

    const navigate= useNavigate();

    useEffect(()=>{
      async function loadUser(params) {
        const storageUser = localStorage.getItem("@ticketsPRO");

        if(storageUser){
          setUser(JSON.parse(storageUser));
          setLoading(false);
        }

        setLoading(false);
      }

      loadUser();
    },[])

  // async  function signIn(email,password){
  //     setLoadingAuth(true);
  // await signInWithEmailAndPassword(auth,email,password)
  // .then(async(value)=>{
  //   let  uid= value.user.uid;
  //   const docRef= doc(db,"users", uid );
  //   const docSnap= await getDoc(docRef);
  //       console.log("Dados do Firestore:", docSnap.data());
  //   let data = {
  //     uid: uid,
  //     nome: docSnap.data().nome,
  //     email: value.user.email,
  //     avatarUrl: docSnap.data().avatarUrl || null,
  //   };
  

  //   setUser(data);
  //   storageUser(data);
  //   setLoadingAuth(false);
  //   toast.success("Bem vindo(a) de volta!");
  //   navigate("/dashboard");
     
    
  // })

  // .catch((error)=>{
  //   console.log(error);
  //   setLoadingAuth(false);
  //   toast.error("Ops algo deu errado :(")
  // })


  //   }


async function signIn(email, password) {
  console.log("Função signIn foi chamada!"); // Verifica se a função é executada
  setLoadingAuth(true);

  await signInWithEmailAndPassword(auth, email, password)
    .then(async (value) => {
      console.log("Usuário autenticado:", value.user); // Verifica se o login foi bem-sucedido

      let uid = value.user.uid;
      const docRef = doc(db, "users", uid);

      try {
        const docSnap = await getDoc(docRef);
        console.log("Documento Firestore encontrado?", docSnap.exists());

        if (docSnap.exists()) {
          console.log("Dados do Firestore:", docSnap.data());

          let data = {
            uid: uid,
            nome: docSnap.data().nome || "Nome não encontrado",
            email: value.user.email,
            avatarUrl: docSnap.data().avatarUrl || null,
          };

          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          toast.success("Bem-vindo(a) de volta!");
          navigate("/dashboard");
        } else {
          console.log("Usuário não encontrado no Firestore.");
          toast.error("Usuário não encontrado no banco de dados.");
          setLoadingAuth(false);
        }
      } catch (error) {
        console.log("Erro ao buscar documento no Firestore:", error);
        toast.error("Erro ao buscar dados do usuário.");
        setLoadingAuth(false);
      }
    })
    .catch((error) => {
      console.log("Erro ao fazer login:", error);
      setLoadingAuth(false);
      toast.error("Ops, algo deu errado :(");
    });
}





async function signUp(email,password,name){
 setLoadingAuth(true);
 await createUserWithEmailAndPassword(auth, email, password)
   .then(async (value) => {
     let uid = value.user.uid;

     await setDoc(doc(db, "users", uid), {
       nome: name,
       avatarUrl: "URL_PADRAO_DA_IMAGEM",
     }).then(() => {
       let data = {
         uid: uid,
         nome: name,
         email: value.user.email,
         avatarUrl: null,
       };
      
       setUser(data);
       storageUser(data);
       setLoadingAuth(false);
       toast.success("Seja bem vindo ao sistema!");
       navigate("/dashboard");
       
     });
   
   })

   .catch((error) => {
     console.log(error);
     setLoadingAuth(false);
   });
}

function storageUser(data){
  localStorage.setItem("@ticketsPRO", JSON.stringify(data))
}

async function logout(params) {
  await signOut(auth);
  localStorage.removeItem("@ticketsPRO");
  setUser(null);

  
}



    return (
      <AuthContext.Provider
        value={{
          signed: !!user,
          user,
          signIn,
          signUp,
          logout,
          loadingAuth,
          loading,
          storageUser,
          setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
}

export default AuthProvider;