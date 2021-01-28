const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  port: 5432,
  database: "elecciones",
});
const consultar = async () => {
  try {
    const result = await pool.query("SELECT * FROM candidatos");
    return result.rows;
  } catch (e) {
    console.log(e.code);
    return e;
  }
};

const insertar = async (datos) => {
  const consulta = {
    text:
      "INSERT INTO candidatos (nombre, foto, color, votos) VALUES ($1, $2, $3, 0)",
    values: datos,
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (e) {
    console.log(e.code);
    return e;
  }
};

const eliminar = async (id) => {
  const deleteUser = {
    text: "DELETE FROM candidatos WHERE id = $1",
    values: [id],
  };

  try {
    const eliminarCandidato = await pool.query(deleteUser);
    return eliminarCandidato;
  } catch (e) {
    console.log(e.code);
    return e;
  }
};

const editar = async (id, nombre, foto) => {
  const consulta = {
    text: "UPDATE candidatos SET nombre = $2, foto = $3 WHERE id = $1",
    values: [id, nombre, foto],
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (e) {
    console.log(e);
  }
};

const voto = async (estado, votos, ganador) => {
  const insertVote = {
    text: "INSERT INTO historial (estado, votos, ganador) VALUES ($1, $2, $3)",
    values: [estado, votos, ganador],
  };
  const updateVote = {
    text: "UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2",
    values: [votos, ganador],
  };
  try {
    await pool.query("BEGIN");
    await pool.query(insertVote);
    await pool.query(updateVote);
    await pool.query("COMMIT");
    return true; //VERIFICAR ERROR
  } catch (e) {
    await pool.query("ROLLBACK");
    return false; //RETORNAR
  }
};

const historial = async () => {
  try {
    const consulta = {
      text: "SELECT * FROM historial",
      rowMode: "array",
    };
    const result = await pool.query(consulta);
    return result.rows;
  } catch (e) {
    console.log(e.code);
    return e;
  }
};

module.exports = { insertar, consultar, eliminar, editar, voto, historial };
