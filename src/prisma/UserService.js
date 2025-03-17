const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createUser(name, email, password) {
  try {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
  } catch (error) {
    console.error("Erro ao criar o usuário:", error);
  }
}

async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
  }
}

async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });
    return user;
  } catch (error) {
    console.error("Erro ao buscar o usuário:", error);
  }
}

async function deleteUser(id) {
  try {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error("Erro ao deleta o usuário:", error);
  }
}

async function updateUser(id, name, email, password) {
  try {
    await prisma.user.update({
      where: { id: id },
      data: { name, email, password },
    });
  } catch (error) {
    console.error("Erro ao atualizar o usuário:", error);
  }
}

module.exports = { createUser, getUsers, getUserById, deleteUser, updateUser };
