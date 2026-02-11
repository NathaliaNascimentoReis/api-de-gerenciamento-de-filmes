import * as model from "../models/moviesModel.js";

export const getAll = async (req, res) => {
  try {
    const movies = await model.findAll(req.query);

    if (!movies || movies.length === 0) {
      return res.status(200).json({
        message: "Nenhum registro encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      total: movies.length,
      message: "Lista de filmes disponíveis",
      movies,
    });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    res.status(500).json({ error: "Erro ao buscar registros" });
  }
};

export const create = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados do exemplo!",
      });
    }

    const { title, description, runtime, genre, rating } = req.body;

    const data = await model.create({
      title,
      description,
      runtime: runtime ? parseInt(runtime) : undefined,
      genre,
      rating: rating ? parseFloat(rating) : undefined,
    });

    res.status(201).json({
      message: "Registro cadastrado com sucesso!",
      data,
    });
  } catch (error) {
    console.error("Erro ao criar filme:", error.message);
    
    const statusCode = error.status;

    res.status(400).json({
      status: statusCode,
      success: false,
      error: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }

    const data = await model.findById(id);
    if (!data) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }
    res.json({ data });
  } catch (error) {
    console.error("Erro ao buscar:", error);
    res.status(500).json({ error: "Erro ao buscar registro" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Corpo da requisição vazio. Envie os dados do exemplo!",
      });
    }

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const exists = await model.findById(id);
    if (!exists) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para atualizar." });
    }

    const data = await model.update(id, req.body);
    res.json({
      message: `O registro "${data.nome}" foi atualizado com sucesso!`,
      data,
    });
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    res.status(500).json({ error: "Erro ao atualizar registro" });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    const exists = await model.findById(id);
    if (!exists) {
      return res
        .status(404)
        .json({ error: "Registro não encontrado para deletar." });
    }

    await model.remove(id);
    res.json({
      message: `O registro "${exists.title}" foi deletado com sucesso!`,
      deletado: exists,
    });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: "Erro ao deletar registro" });
  }
};
