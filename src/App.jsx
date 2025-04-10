import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./assets/roger_logo.jpg";

const menuItems = {
  lanches: [
    { name: "X-Burguer", price: 15, description: "Pão, hambúrguer, queijo e maionese artesanal", image: "https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/7290/64cebbbf5e9386fmo7.webp" },
    { name: "X-Salada", price: 18, description: "Pão, hambúrguer, queijo, alface, tomate e maionese", image: "https://sachefmio.blob.core.windows.net/fotos/x-burguer-73517.jpg" },
    { name: "X-Bacon", price: 20, description: "Pão, hambúrguer, bacon, queijo e maionese da casa", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLjBZocHZprMWfYFkVpY6jb35WBnDa3dVni5-_JNR95g_aGVocG6SeAHtTBeCFTRZCy5c&usqp=CAU" }
  ],
  bebidas: [
    { name: "Refrigerante Lata", price: 6, description: "Coca-Cola, Guaraná, Fanta (350ml)", image: "https://alloydeliveryimages.s3.sa-east-1.amazonaws.com/item_images/3812/66214745285d5dusdc.webp" },
    { name: "Água Mineral", price: 3, description: "Com ou sem gás (500ml)", image: "https://drogariamoderna.vtexassets.com/arquivos/ids/251997-800-auto?v=638151218022670000&width=800&height=auto&aspect=true" }
  ],
  porcoes: [
    { name: "Batata Frita", price: 12, description: "Porção média de batata frita", image: "https://static.itdg.com.br/images/1200-630/16976699d08c8e6cd92db601741e0038/353026-original.jpg" },
    { name: "Nuggets", price: 14, description: "Porção com 10 unidades", image: "https://imagens.jotaja.com/produtos/b73498c1-56b7-4d86-9853-c8ad503a0226.jpg" }
  ]
};

export default function RogerLanches() {
  const [pedido, setPedido] = useState([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [pagamento, setPagamento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mostrarBotoesDados, setMostrarBotoesDados] = useState(false);

  useEffect(() => {
    const savedPedido = localStorage.getItem("pedido");
    const savedNome = localStorage.getItem("nome");
    const savedTelefone = localStorage.getItem("telefone");
    const savedPagamento = localStorage.getItem("pagamento");
    const savedEndereco = localStorage.getItem("endereco");

    if (savedPedido) setPedido(JSON.parse(savedPedido));
    if (savedNome) setNome(savedNome);
    if (savedTelefone) setTelefone(savedTelefone);
    if (savedPagamento) setPagamento(savedPagamento);
    if (savedEndereco) setEndereco(savedEndereco);
  }, []);

  useEffect(() => {
    localStorage.setItem("pedido", JSON.stringify(pedido));
  }, [pedido]);

  useEffect(() => {
    localStorage.setItem("nome", nome);
  }, [nome]);

  useEffect(() => {
    localStorage.setItem("telefone", telefone);
  }, [telefone]);

  useEffect(() => {
    localStorage.setItem("pagamento", pagamento);
  }, [pagamento]);

  useEffect(() => {
    localStorage.setItem("endereco", endereco);
  }, [endereco]);

  const getEmoji = (itemName) => {
    const nome = itemName.toLowerCase();
    if (nome.includes("burguer") || nome.includes("x-")) return "🍔";
    if (nome.includes("batata")) return "🍟";
    if (nome.includes("nuggets")) return "🍗";
    if (nome.includes("refrigerante")) return "🥤";
    if (nome.includes("água")) return "💧";
    return "🍽️";
  };

  const getPagamentoEmoji = (forma) => {
    if (forma === "Dinheiro") return "💵";
    if (forma === "Pix") return "🔁";
    if (forma?.includes("Cartão")) return "💳";
    return "";
  };

  const adicionarItem = (item) => {
    setPedido([...pedido, item]);
    setFeedback(true);
    setMostrarBotoesDados(true);
    setTimeout(() => setFeedback(false), 1500);
  };

  const removerItem = (index) => {
    const novoPedido = [...pedido];
    novoPedido.splice(index, 1);
    setPedido(novoPedido);
  };

  const limparPedido = () => {
    setPedido([]);
    setNome("");
    setTelefone("");
    setPagamento("");
    setEndereco("");
    localStorage.removeItem("pedido");
    localStorage.removeItem("nome");
    localStorage.removeItem("telefone");
    localStorage.removeItem("pagamento");
    localStorage.removeItem("endereco");
  };

  const recuperarDadosSalvos = () => {
    const savedNome = localStorage.getItem("nome") || "";
    const savedTelefone = localStorage.getItem("telefone") || "";
    const savedPagamento = localStorage.getItem("pagamento") || "";
    const savedEndereco = localStorage.getItem("endereco") || "";

    setNome(savedNome);
    setTelefone(savedTelefone);
    setPagamento(savedPagamento);
    setEndereco(savedEndereco);
  };

  const limparDadosSalvos = () => {
    localStorage.removeItem("nome");
    localStorage.removeItem("telefone");
    localStorage.removeItem("pagamento");
    localStorage.removeItem("endereco");
    alert("Seus dados foram apagados com sucesso.");
  };

  const calcularTotal = () => pedido.reduce((total, item) => total + item.price, 0);

  const validarEConfirmarPedido = () => {
    if (!nome || !telefone || !pagamento || !endereco) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    if (!/^\d{10,11}$/.test(telefone)) {
      alert("Telefone inválido. Use apenas números com DDD.");
      return;
    }
    setShowModal(true);
  };

  const enviarPedido = () => {
    const mensagem = encodeURIComponent(
      `Olá, gostaria de fazer o seguinte pedido:\n\n${pedido
        .map((item) => `${getEmoji(item.name)} ${item.name} - R$ ${item.price}`)
        .join("\n")}\n\n💰 Total: R$ ${calcularTotal()}\n\n👤 Nome: ${nome}\n📞 Telefone: ${telefone}\n🏠 Endereço: ${endereco}\n💳 Pagamento: ${pagamento} ${getPagamentoEmoji(pagamento)}`
    );
    window.open(`https://wa.me/1540028922?text=${mensagem}`, "_blank");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 p-6 text-yellow-900 flex flex-col justify-between">
    <div>
      <motion.img
        src={Logo}
        alt="Logo Roger Lanches"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6 }}
        className="w-48 mx-auto mb-6 rounded-full border-4 border-white shadow-lg"
      />
    </div>

    {mostrarBotoesDados && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center my-6"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={recuperarDadosSalvos}
          className="bg-yellow-800 text-white px-4 py-2 rounded mr-4 hover:bg-yellow-900"
        >
          Usar dados salvos
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={limparDadosSalvos}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Limpar meus dados
        </motion.button>
      </motion.div>
    )}

      {/* Menu horizontal */}
      <div className="overflow-x-auto whitespace-nowrap mb-8">
        {Object.entries(menuItems).map(([categoria, itens]) => (
          <div key={categoria} className="inline-block align-top mr-6 w-80">
            <h2 className="text-2xl mb-4 capitalize text-yellow-800">{categoria}</h2>
            {itens.map((item, idx) => (
              <div key={idx} className="mb-4 bg-white text-black shadow-xl rounded overflow-hidden">
                <div className="p-4">
                  <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded mb-2" />
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-sm mb-2">{item.description}</p>
                  <p className="font-semibold mb-2">R$ {item.price}</p>
                  <button onClick={() => adicionarItem(item)} className="bg-black text-yellow-400 px-4 py-2 rounded hover:bg-yellow-700">
                    Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pedido */}
      {pedido.length > 0 && (
        <div className="mt-8 text-center bg-black bg-opacity-80 p-6 rounded text-white">
          <h2 className="text-2xl mb-4 text-yellow-400">Seu Pedido</h2>
          <ul className="mb-4">
            {pedido.map((item, idx) => (
              <li key={idx} className="mb-2">
                {item.name} - R$ {item.price}{" "}
                <button onClick={() => removerItem(idx)} className="text-red-500 underline ml-2">Remover</button>
              </li>
            ))}
          </ul>
          <p className="font-bold mb-4 text-yellow-300">Total: R$ {calcularTotal()}</p>

          {/* Inputs */}
          <div className="mb-4">
            <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)}
              className="block w-full mb-2 p-2 rounded bg-yellow-100 text-black" />

            <input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)}
              className="block w-full mb-2 p-2 rounded bg-yellow-100 text-black" />

            <input type="text" placeholder="Telefone com DDD" value={telefone} onChange={(e) => setTelefone(e.target.value)}
              className="block w-full mb-2 p-2 rounded bg-yellow-100 text-black" />
            <select value={pagamento} onChange={(e) => setPagamento(e.target.value)}
              className="block w-full p-2 rounded bg-yellow-100 text-black">
              <option value="">Forma de pagamento</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Pix">Pix</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
            </select>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={validarEConfirmarPedido} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Enviar para o WhatsApp
            </button>
            <button onClick={limparPedido} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Apagar Tudo
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-bold mb-4">Confirmar envio do pedido?</h2>
              <p className="mb-4">Total: <strong>R$ {calcularTotal()}</strong></p>
              <div className="flex justify-center gap-4">
                <button onClick={enviarPedido} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Sim</button>
                <button onClick={() => setShowModal(false)} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-sm text-white mt-8 py-4 border-t border-yellow-600">
        <p className="font-bold text-lg">🍔 Roger Lanches</p>
        <p>📞 (15) 40028923</p>
        <p>📍 Rua Exemplo, 123 - Centro - Cidade/SP</p>
      </footer>
    </div>
  );
}
