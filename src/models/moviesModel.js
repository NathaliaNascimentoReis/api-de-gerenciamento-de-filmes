import prisma from "../utils/prismaClient.js";

export const create = async (data) => {
    const camposObrigatorios = [
        "title",
        "description",
        "genre",
        "runtime",
        "rating",
    ];
    
    const camposFaltantes = camposObrigatorios.filter(c => !data[c]);
    
    if (camposFaltantes.length > 0) {
        const erro = new Error('Os seguintes campos são obrigatórios: ' + camposFaltantes.join(", "))
        erro.status = 400;
        erro.success = false;
        throw erro;
    }

    const genrePermitidos = [
      "Ação",
      "Ficção Científica",
      "Drama",
      "Crime",
      "Terror",
      "Animação",
      "Comédia",
      "Suspense",
      "Romance",
    ];
    
    const title = data.title?.trim();
    const description = data.description?.trim();
    const genre = data.genre?.trim();

  if (!title || title.length < 3) {
    const erro = new Error(
      "O título (title) precisa ter no mínimo 3 caractéres",
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  if (!description || description.length < 10) {
    const erro = new Error(
      "A descrição (description) precisa ter no mínimo 10 caractéres",
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  const genreValido = genrePermitidos.find(
    (g) => g.toLowerCase() === genre.toLowerCase(),
  );

  if (!genreValido) {
    const erro = new Error(
      "O gênero deve ser um dos valores: " + genrePermitidos.join(", "),
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  if (!Number.isInteger(data.runtime) || data.runtime <= 0) {
    const erro = new Error(
      "A duração do filme deve ser um valor inteiro, positivo e em minutos",
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  if (data.runtime > 300) {
    const erro = new Error(
      "A duração do filme não pode ser maior que 300 minutos",
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  const movieExiste = await prisma.movie.findFirst({
    where: { title: { equals: title, mode: "insensitive" } },
  });

  if (movieExiste) {
    const erro = new Error("Já existe um filme cadastrado com este título");
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  if (data.rating > 10 || data.rating < 0) {
    throw new Error("A avaliação do filme deve estar entre 0 e 10");
  }

  return await prisma.movie.create({
    data: {
      ...data,
      title,
      description,
      genre: genreValido,
      available: true,
    },
  });
};

export const findAll = async (filters = {}) => {
  const { title, genre, available } = filters;
  const where = {};

  if (title) where.title = { contains: title, mode: "insensitive" };
  if (genre) where.genre = { contains: genre, mode: "insensitive" };
  if (available !== undefined && available !== "") {
    where.available = available === true;
  }

  return await prisma.movie.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  return await prisma.movie.findUnique({
    where: { id: parseInt(id) },
  });
};

export const update = async (id, data) => {
  const title = data.title?.trim();
  const description = data.description?.trim();
  const genre = data.genre?.trim();

  const movieExiste = await prisma.movie.findUnique({
    where: { id: Number(id) },
  });

  if (!movieExiste) {
    const erro = new Error(
      "Filme não encontrado. Verifique se o ID inserido está correto",
    );
    erro.status = 404;
    throw erro;
  }

  if (titleToUpdate !== undefined && titleToUpdate.length < 3) {
    const erro = new Error(
      "O título (title) precisa ter no mínimo 3 caracteres",
    );
    erro.status = 400;
    throw erro;
  }

  if (descriptionToUpdate !== undefined && descriptionToUpdate.length < 3) {
    const erro = new Error(
      "A descrição (description) precisa ter no mínimo 3 caracteres",
    );
    erro.status = 400;
    throw erro;
  }

  if (genretoUpdate) {
  }

  return await prisma.movie.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const remove = async (id) => {
  return await prisma.movie.delete({
    where: { id: parseInt(id) },
  });
};
