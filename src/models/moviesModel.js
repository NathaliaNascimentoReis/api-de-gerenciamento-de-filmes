import prisma from "../utils/prismaClient.js";

export const create = async (data) => {
  const camposObrigatorios = [
    "title",
    "description",
    "genre",
    "runtime",
    "rating",
  ];

  const camposFaltantes = camposObrigatorios.filter((c) => !data[c]);

  if (camposFaltantes.length > 0) {
    const erro = new Error(
      "Os seguintes campos são obrigatórios: " + camposFaltantes.join(", "),
    );
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
      "A duração (runtime) do filme não pode ser maior que 300 minutos",
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
    const erro = new Error("A avaliação do filme deve estar entre 0 e 10");
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  return await prisma.movie.create({
    data: {
      ...data,
      title,
      description,
      runtime,
      genre: genreValido,
      rating,
      available: true,
    },
  });
};

export const findAll = async (filters = {}) => {
  const { title, genre, available, minRating, maxRuntime } = filters;
  const where = {};

  if (title) where.title = { contains: title, mode: "insensitive" };
  if (genre) where.genre = { contains: genre, mode: "insensitive" };

  if (available !== undefined && available !== "") {
    where.available = available === true || available === "true";
  }

  if (minRating) {
    where.rating = { gte: Number(minRating) };
  }

  if (maxRuntime) {
    where.runtime = { lte: Number(maxRuntime) };
  }

  return await prisma.movie.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (id) => {
  const movieId = Number(id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    const erro = new Error("O ID digitado não é um número válido");
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  const movie = await prisma.movie.findUnique()({
    where: { id: movieId },
  });

  if (!movie) {
    const erro = new Error("O filme não foi encontrado");
    erro.status = 404;
    erro.success = false;
    throw erro;
  }

  return movie;
};

export const update = async (id, data) => {
  const movieId = Number(id);

  if (isNaN(movieId) || movieId <= 0) {
    const erro = new Error("O ID digitado não é um número válido");
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  const movieExiste = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movieExiste) {
    const erro = new Error(
      "Filme não encontrado. Verifique se o ID inserido está correto",
    );
    erro.status = 404;
    erro.success = false;
    throw erro;
  }

  if (movieExiste.available === false || data.available === "false") {
    const erro = new Error("Filmes indisponíveis não podem ser atualizados.");
    erro.status = 403;
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

  const genre = data.genre?.trim();
  const title = data.title?.trim();
  const description = data.description?.trim();

  if (title !== undefined && title.length < 3) {
    const erro = new Error(
      "O título (title) precisa ter no mínimo 3 caracteres",
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  const movieTituloExiste = await prisma.movie.findFirst({
    where: { title: { equals: title, mode: "insensitive" } },
  });

  if (movieTituloExiste) {
    const erro = new Error("Já existe um filme cadastrado com este título");
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  if (description !== undefined && description.length < 10) {
    const erro = new Error(
      "A descrição (description) precisa ter no mínimo 10 caracteres",
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
      "A duração (runtime) do filme não pode ser maior que 300 minutos",
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  if (data.available === false) {
    const erro = new Error(
      "Filmes indisponíveis não podem ser atualizados",
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  return await prisma.movie.update({
    where: { id: movieId },
    data: {
      ...data,
      title,
      description,
      available:
        data.available !== undefined
          ? data.available === true || data.available === "true"
          : undefined,
    },
  });
};

export const remove = async (id) => {
  const movieId = Number(id);

  if (isNaN(movieId) || movieId <= 0) {
    const erro = new Error("O ID digitado não é um número válido");
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    const erro = new Error("O filme não foi encontrado");
    erro.status = 404;
    erro.success = false;
    throw erro;
  }

  if (movie.rating >= 9) {
    const erro = new Error(
      "Não é possível deletar um filme com avaliação maior ou igual a 9",
    );
    erro.status = 400;
    erro.success = false;
    throw erro;
  }

  return await prisma.movie.delete({
    where: { id: movieId },
  });
};
