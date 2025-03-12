const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createUser(name, email, password) {
  try {
    const user = await prisma.user.create({
      data: {
        name: name,      
        email: email,    
        password: password,
      },
    });
    console.log('Usuário criado:', user);
  } catch (error) {
    console.error('Erro ao criar o usuário:', error);
  }
}

async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
  }
}

module.exports = { createUser, getUsers };
