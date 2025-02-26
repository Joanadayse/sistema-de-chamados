import { useState } from "react";
import { db } from "../../services/firebaseConection";
import { collection ,addDoc } from "firebase/firestore";

export default function UploadImage (){
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Converte imagem para Base64
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const handleUpload = async () => {
      if (!image) return alert("Selecione uma imagem!");

      setLoading(true);
      try {
        // Converte a imagem para Base64
        const base64Image = await convertToBase64(image);

        // Salva no Firestore
        await addDoc(collection(db, "imagens"), {
          imagem: base64Image,
          timestamp: new Date(),
        });

        alert("Imagem salva com sucesso!");
        setImage(null);
      } catch (error) {
        console.error("Erro ao salvar imagem: ", error);
        alert("Erro ao enviar imagem");
      }
      setLoading(false);
    };

    return (
      <div>
        <h2>Upload de Imagem</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Enviando..." : "Enviar Imagem"}
        </button>
      </div>
    );

}