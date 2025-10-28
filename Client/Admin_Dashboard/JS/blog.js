//--------------------------------------
//          Render user table
//--------------------------------------
function updateBlogsTable(blogs) {
  const tableBody = document.querySelector('#blogsTable tbody');
  let html = '';

  if (blogs.length > 0) {
    blogs.forEach((blog) => {
        date=new Date(blog.date).toLocaleDateString();
      html += `
        <tr>
          <td>${blog.title}</td>
          <td class="author-blog-chip"><span class="author-blog">${blog.author}</span></td>
          <td>${date}</td>
          <td>${blog.readTime}</td>
          <td>${blog.views}</td>
          <td>${blog.link && blog.link !== "#" ? `<a href="${blog.link}" target="_blank">View</a>` : "-"}</td>
          <td>
            <div class="action-buttons">
              <button class="table-btn btn-edit" onclick='openBlogModal(${JSON.stringify(blog)})'>
                <img src="./img_dashbord/table/edit.svg" class="edit-icon"/>
              </button>
              <button class="table-btn btn-delete" onclick="deleteItem('${blog._id}','blogs',updateBlogsTable)">
                <img src="./img_dashbord/table/delete.svg" class="delete-icon"/>
              </button>
            </div>
          </td>
        </tr>`;
    });
  } else {
    html = '<tr><td colspan="7" class="text-center">No blogs found.</td></tr>';
  }
  tableBody.innerHTML = html;
}



//--------------------------------------
//     Open modal for Add/Edit user
//--------------------------------------
function openBlogModal(blog = null) {
  const modal = document.getElementById('blogModal');
  const title = document.getElementById('blogModalTitle');
  const form = document.getElementById('blogForm');
  const submitBtn = document.getElementById("blogSubmitBtn");
  
  form.reset();
  document.getElementById('blogId').value = '';

  if (blog) {
    // Editing existing user
    title.textContent = 'Edit Blog';
    submitBtn.textContent= 'Save Changes'

    document.getElementById('blogId').value = blog._id;
    document.getElementById('blogTitle').value = blog.title;
    document.getElementById('blogAuthor').value = blog.author;
    document.getElementById('blogDate').value = blog.date ? new Date(blog.date).toISOString().split('T')[0] : '';
    document.getElementById('blogReadTime').value = blog.readTime;
    document.getElementById('blogDescription').value = blog.description;
    document.getElementById('blogLink').value = blog.link;
  } else {
    // Adding new user
    title.textContent = 'Add Blog';
    submitBtn.textContent = 'Add Blog';
  }
  modal.classList.add('active');
}


// Handle form submit
document.getElementById('blogForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const blogId = document.getElementById('blogId').value;
  const title=document.getElementById('blogTitle').value;
  const author=document.getElementById('blogAuthor').value;
  const blogDate=document.getElementById('blogDate').value;
  const readTime=document.getElementById('blogReadTime').value;
  const description=document.getElementById('blogDescription').value;
  const link=document.getElementById('blogLink').value;

  const blogData={
    title,
    author,
    blogDate,
    readTime,
    description,
    link
  }

  if (blogId) {
    // Update existing blog
    await editItem("blogs",blogId,blogData,"blogs",updateBlogsTable,"blogModal");
  } else {
    // Create new blog
    await createItem("blogs", blogData,updateBlogsTable,"blogModal","blogs")
  }
});


