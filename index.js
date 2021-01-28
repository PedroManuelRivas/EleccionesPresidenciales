const http = require("http");
const fs = require("fs");
const url = require("url");
const {
  consultar,
  insertar,
  eliminar,
  editar,
  voto,
  historial,
} = require("./consultas");

http
  .createServer(async (req, res) => {
    //Renderización HTML
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("content-type", "text/html");
      const html = fs.readFileSync("index.html");
      res.end(html);
    } //Requerimiento 1 Insertar Candidato
    else if (req.url == "/candidato" && req.method == "POST") {
      let body = "";
      req.on("data", (datos) => {
        body += datos;
      });
      req.on("end", async () => {
        const { nombre, foto, color } = JSON.parse(body);
        const respuesta = await insertar([nombre, foto, color]);
        res.end(JSON.stringify(respuesta));
      });
    } //Requerimiento 2 Ontener candidatos
    else if (req.url == "/candidatos" && req.method == "GET") {
      const registros = await consultar();
      res.end(JSON.stringify(registros));
    } //Requerimiento 3 Eliminar candidatos
    else if (req.url.startsWith("/candidato") && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query;
      await eliminar(id);
      res.end();
    } else if (req.url.startsWith("/candidato") && req.method == "PUT") {
      let body = "";
      req.on("data", (datos) => {
        body += datos;
      });
      req.on("end", async () => {
        const { id, name, img } = JSON.parse(body);
        const respuesta = await editar(id, name, img);
        res.end(JSON.stringify(respuesta));
      });
    } else if (req.url.startsWith("/votos") && req.method == "POST") {
      let body = "";
      req.on("data", (datos) => {
        body += datos;
      });
      req.on("end", async () => {
        const { estado, votos, ganador } = JSON.parse(body);
        const result = await voto(estado, votos, ganador);
        if (result) {
          res.end(JSON.stringify({})); //Cliente espera un objeto, por lo que debemos finalizar enviando un objeto vacio.
        } else {
          res.statusCode = 500;
          res.end(); //throw new Error("Error 500")
        }
      });
    } else if (req.url.startsWith("/historial") && req.method == "GET") {
      const registros = await historial();
      res.end(JSON.stringify(registros));
    } else {
      res.end("Pagina no encontrada");
    }
  })
  .listen(3000, () => {
    console.log("Encendido en puerto 3000");
  });
