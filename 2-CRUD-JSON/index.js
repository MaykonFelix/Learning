const express = require("express");
const server = express();
const router = express.Router();
const fs = require("fs"); // File System ***Gerenciar Arquivo
server.use(express.json({ extend: true }));

// Função para converter o JSON para Object
const readFile = () => {
  const content = fs.readFileSync("./data/items.json", "utf-8"); //Função para pegar o JSON
  return JSON.parse(content);
};

const writeFile = (content) => {
  const updateFile = JSON.stringify(content);
  fs.writeFileSync("./data/items.json", updateFile, "utf-8");
};

// Fazer a Leitura do  Arquivo JSON
router.get("/", (req, res) => {
  const content = readFile();
  res.send(content);
});

router.post("/", (req, res) => {
  const { name, email, phone } = req.body;
  const currentContent = readFile();

  const id = Math.random().toString(32).substring(2, 9);
  console.log(id);

  currentContent.push({ id, name, email, phone });
  writeFile(currentContent);
  res.send({ id, name, email, phone });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  const { name, email, phone } = req.body;

  const currentContent = readFile();
  const selectedItem = currentContent.findIndex((item) => item.id === id);

  const {
    id: cId,
    name: cName,
    email: cEmail,
    phone: cPhone,
  } = currentContent[selectedItem];

  const newObject = {
    id: cId,
    name: name ? name : cName,
    email: email ? email : cEmail,
    phone: phone ? phone : cPhone,
  };

  currentContent[selectedItem] = newObject;
  writeFile(currentContent);

  res.send(newObject);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const currentContent = readFile();
  const selectedItem = currentContent.findIndex((item) => item.id === id);
  currentContent.splice(selectedItem, 1);
  writeFile(currentContent);

  res.send("Item Apagado!");
});

server.use(router);

server.listen(3000, () => {
  console.log("Servidor ON");
});
