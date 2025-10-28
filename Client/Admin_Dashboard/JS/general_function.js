//******************************************* */
//             Modal functions
//******************************************* */
function showModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// Error message display function
function showPopup(message, type = "success") {
  const popup = document.getElementById("globalPopup");
  const msg = document.getElementById("popupMessage");
  const icon = document.getElementById("popupIcon");

  // Set message and type
  msg.textContent = message;

  // Set icon and color
  if (type === "success") {
    icon.textContent = "✅";
    popup.classList.remove("error");
    popup.classList.add("success");
  } else {
    icon.textContent = "❌";
    popup.classList.remove("success");
    popup.classList.add("error");
  }

  // Show popup
  popup.classList.remove("hidden-section");
  popup.classList.add("show");

  // Auto hide after 3 seconds
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.classList.add("hidden-section");
    }, 400);
  }, 3000);
}



//*********************************************** */
//              Load function
//*********************************************** */
async function loadSection(type, updateTable) {
  console.log("this genereal function");
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE_URL}/${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Parse JSON
    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`${type} data is loaded successfully`);
      updateTable(data.data);
    } else {
      console.log(`Faile to load ${type}:`, data.message);
    }
  } catch (error) {
    console.log(`Error loading ${type}:`, error);
    updateTable([]);
  } finally {
    showLoading(false);
  }
}

//**************************************************** */
//                   Delete function
//**************************************************** */
async function deleteItem(userId, type, updateTable) {
  if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

  try {
    const response = await fetch(`${API_BASE_URL}/${type}/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`${type} deleted successfully!`);
      showPopup(`${type} deleted successfully!`, "success");
      loadSection(type, updateTable);
      //   reloadFunction();
    }else{
      showPopup(data.message || `Failed to delete ${type}.`, "error");
    }
  } catch (error) {
    console.log(`Failed to ${type}:`, error.message);
    showPopup(`Failed to delete ${type}.`, "error");
  } finally {
    showLoading(false);
  }
}

//************************************************* */
//               CREATE FUNCTION
//************************************************* */
async function createItem(type, data, updateTable, modalId, endpoint) {
  // Basic validation
  if (!data || Object.values(data).some((v) => v === "" || v === null)) {
    alert("All fields are required!");
    return;
  }

  try {
    showLoading(true);
    const res = await fetch(`${API_BASE_URL}/${type}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      console.log(`${type} created successfully!`);
      showPopup(`${type} created successfully!`, "success");
      closeModal(modalId);
      loadSection(endpoint, updateTable);
    } else {
      console.log(`Failed to create ${type}`);
      showPopup(result.message || `Failed to create ${type}.`, "error");
    }
  } catch (error) {
    console.log(`Failed to create ${type}: ` + error.message);
    showPopup(error.message || `Failed to create ${type}.`, "error");
  } finally {
    showLoading(false);
  }
}

//************************************************************ */
//                      UPDATE function
//************************************************************ */
async function editItem(
  type,
  itemId,
  updatedData,
  endpoint,
  updateTable,
  modalId
) {
  try {
    showLoading(true);
    const res = await fetch(`${API_BASE_URL}/${type}/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      console.log(`${type} updated successfully!`);
      showPopup(`${type} updated successfully!`, "success");
      closeModal(modalId);
      loadSection(endpoint, updateTable);
    }else{
      showPopup(result.message || `Failed to update ${type}.`, "error");
    }
  } catch (error) {
    console.log(`Failed to update ${type}: ` + error.message);
  } finally {
    showLoading(false);
  }
}



//************************************************* */
//              UPDATE WITH FILE function
//************************************************* */
async function editItemWithImage(
  type,
  endpoint,
  itemId,
  formData,
  updateTable,
  modalId
) {
  try {
    showLoading(true);
    const res = await fetch(`${API_BASE_URL}/${type}/${itemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result.success) {
      console.log(`${type} created successfully!`);
      showPopup(`${type} update successfully!`, "success");
      closeModal(modalId);
      loadSection(endpoint, updateTable);
    } else {
      console.log(`Failed to update ${type}`);
      showPopup(result.message || `Failed to update ${type}.`, "error");
    }
    
  } catch (error) {
    console.log(`Failed to update ${type}: ` + error.message);
    showPopup(`Failed to update ${type}.`, "error");
  } finally {
    showLoading(false);
  }
}



//************************************************* */
//              create with image function
//************************************************* */
async function createItemWithImage(
  type,
  formData,
  updateTable,
  modalId,
  endpoint
) {
  // Basic validation
  if (
    !formData ||
    Object.values(formData).some((v) => v === "" || v === null)
  ) {
    alert("All fields are required!");
    return;
  }

  try {
    showLoading(true);
    const res = await fetch(`${API_BASE_URL}/${type}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok && result.success) {
      console.log(`${type} created successfully!`);
      showPopup(`${type} created successfully!`, "success");
      closeModal(modalId);
      loadSection(endpoint, updateTable);
    } else {
      console.log(`Failed to create ${type}`);
      showPopup(result.message || `Failed to create ${type}.`, "error");
    }
  } catch (error) {
    console.log(`Failed to create ${type}: ` + error.message);
    showPopup(`Failed to create ${type}.`, "error");
  } finally {
    showLoading(false);
  }
}



// -------------------------------------------------------------------
//                     Load Contributors
// -------------------------------------------------------------------
// Load contributors for dropdown
async function loadContributors(selectId,placeholder="Select contributors") {
  try {
    const res = await fetch(`${API_BASE_URL}/contributors`,{
      method:"GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    const selectElement = $(`#${selectId}`);
    selectElement.empty(); // Clear old options

    data.data.forEach((contributor) => {
      const option = new Option(contributor.name, contributor._id, false, false);
      selectElement.append(option);
    });

    // Initialize or refresh Select2
    selectElement.select2({
      placeholder,
      width: "100%",
      allowClear: true,
    });

    selectElement.trigger("change"); // refresh Select2
  } catch (err) {
    console.error("Error loading contributors:", err);
  }
}




