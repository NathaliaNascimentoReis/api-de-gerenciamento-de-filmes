import prisma from '../utils/prismaClient.js';

export const create = async (data) => {

    const title = data.title?.trim();
    const description = data.description?.trim();

    if (!title || title.length < 3) {
        throw new Error('O título (title) precisa ter no mínimo 3 caractéres');
    }

    if (!description || description.length < 10) {
        throw new Error('A descrição (description) precisa ter no mínimo 10 caractéres');
    }

    if (!Number.isInteger(data.runtime) || data.runtime <= 0) {
        throw new Error('A duração do filme deve ser um valor positivo e em minutos');
    }

    if (data.runtime > 300) {
        throw new Error('A duração do filme não pode ser maior que 300 minutos');
    }

    if (data.rating > 10 || data.rating < 0) {
        throw new Error('A avaliação do filme deve estar entre 0 e 10');
    }

    return await prisma.movie.create({
        data: {
            ...data,
            title,
            description,
            available: true
        },
    });
};

export const findAll = async (filters = {}) => {
    const { title, genre, available } = filters;
    const where = {};

    if (title) where.title = { contains: title, mode: 'insensitive' };
    if (genre) where.genre = { contains: genre, mode: 'insensitive' };
    if (available !== undefined && available !== '') {
        where.available = available === true;
    }

    return await prisma.movie.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
};

export const findById = async (id) => {
    return await prisma.movie.findUnique({
        where: { id: parseInt(id) },
    });
};

export const update = async (id, data) => {
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