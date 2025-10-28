//--------------------------------------
//          Render user table
//--------------------------------------
function updateUsersTable(users) {
  const tableBody = document.querySelector('#usersTable tbody');
  let html = '';

  if (users.length > 0) {
    users.forEach((user) => {
      const createdDate = new Date(user.createAt).toLocaleDateString();
      html += `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${createdDate}</td>
          <td>
            <div class="action-buttons">
              <button class="table-btn btn-edit" onclick='openUserModal(${JSON.stringify(user)})'>
                <img src="./img_dashbord/table/edit.svg" class="edit-icon"/>
              </button>
              <button class="table-btn btn-delete" onclick="deleteItem('${user._id}','admin/users',updateUsersTable)">
                <img src="./img_dashbord/table/delete.svg" class="delete-icon"/>
              </button>
            </div>
          </td>
        </tr>`;
    });
  } else {
    html = '<tr><td colspan="5" class="text-center">No users found.</td></tr>';
  }
  tableBody.innerHTML = html;
}



//--------------------------------------
//     Open modal for Add/Edit user
//--------------------------------------
function openUserModal(user = null) {
  const modal = document.getElementById('userModal');
  const title = document.getElementById('userModalTitle');
  const form = document.getElementById('userForm');
  const passwordGroup=document.getElementById('passwordGroup');
  if (user) {
    // Editing existing user
    title.textContent = 'Edit User';
    document.getElementById('userId').value = user._id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;

    passwordGroup.style.display='none';
  } else {
    // Adding new user
    title.textContent = 'Add User';
    form.reset();
    document.getElementById('userId').value = '';
  }
  modal.classList.add('active');
}


// Handle form submit
document.getElementById('userForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const userId = document.getElementById('userId').value;
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userPassword') ? document.getElementById('userPassword').value : '';
  const role = document.getElementById('userRole').value;

  const userData={name,email,password,role};
  const updatedData={name,email,role};

  if (userId) {
    // Update existing user
    await editItem("admin/users",userId,updatedData,"admin/users",updateUsersTable,"userModal");
  } else {
    // Create new user
    await createItem("auth/register", userData,updateUsersTable,"userModal","admin/users")
  }
});
