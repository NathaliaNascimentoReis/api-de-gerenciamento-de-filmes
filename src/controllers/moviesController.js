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
    console.error("Erro ao visualizar filmes:", error.message);

    const statusCode = error.status ?? 500;

    res.status(statusCode).json({
      status: statusCode,
      success: false,
      error: error.message || "Erro interno do servidor",
    });
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

    const statusCode = error.status ?? 500;

    res.status(statusCode).json({
      status: statusCode,
      success: false,
      error: error.message,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await model.findById(id);

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Erro ao visualizar filme:", error.message);

    const statusCode = error.status ?? 500;

    res.status(statusCode).json({
      status: statusCode,
      success: false,
      error: error.message,
    });
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

    if (!id) {
      return res.status(400).json({
        error: "ID não informado na rota",
      });
    }

    const data = await model.update(id, req.body);
    res.json({
      message: `O registro "${data.nome}" foi atualizado com sucesso!`,
      data,
    });
  } catch (error) {
    console.error("Erro ao atualizar filme:", error.message);

    const statusCode = error.status ?? 500;

    res.status(statusCode).json({
      status: statusCode,
      success: false,
      error: error.message || "Erro interno do servidor",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await model.remove(id);

    res.json({
      status: 200,
      success: true,
      message: `O registro ${deleted.title} foi deletado com sucesso!`,
      deletado: deleted,
    });
  } catch (error) {
    console.error("Erro ao deletar filme:", error.message);

    const statusCode = error.status ?? 500;

    res.status(400).json({
      status: statusCode,
      success: false,
      error: error.message,
    });
  }
};
