// index.html (renderer.js)

function showInsertUser() {
  api.showInsertUser();
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
        `;
      userTableBody.appendChild(row);
    });
  });
}

api.selectUsers();
showUsers();

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
    showUsers();
  }
});
