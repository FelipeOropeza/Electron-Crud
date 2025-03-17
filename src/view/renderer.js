// index.html (renderer.js)

function showInsertUser() {
  api.showInsertUser();
}

function showUpdateUser(id) {
  api.showUpdateUser(id);
}

api.selectUsers();

function deleteUser(id) {
  api.deleteUser(id);
}

function showUsers() {
  api.onUsersSelected((event, response) => {
    const users = response.users;
    const userTableBody = document.getElementById("userTableBody");

    userTableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.password}</td>
          <td>
          <button type="button" onclick="deleteUser('${user.id}')" class="btn btn-danger">Deletar</button>
          <button type="button" onclick="showUpdateUser('${user.id}')" class="btn btn-warning">Editar</button>
          </td>
        `;
      userTableBody.appendChild(row);
    });
  });
}

showUsers();

api.response((event, response) => {
  if (response.success) {
    api.selectUsers();
    showUsers();
  }
});

// formUser.html (renderer.js)

function insertUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  api.insertUser(name, email, password);
}

api.onUserInserted((event, response) => {
  if (response.success) {
    api.closeForm();
  }
});

// formUserUpdate.html (renderer.js)

api.onSetUser((event, { user }) => {
  document.getElementById("id").value = user.id;
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  document.getElementById("password").value = user.password;
});

function updateUser() {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  api.updateUser(id, name, email, password);
}

api.onUserUpdated((event, response) => {
  if (response.success) {
    api.closeForm();
  }
});