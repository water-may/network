export function load_posts(postnm, pgno)
{
  // loads all post in chronological order
  document.querySelector("#posts-view-container").innerHTML = "";
  fetch(`/post/${ postnm }/${ pgno }`)
  .then(response => response.json())
  .then(data => {
    let posts = data.posts;
    let user = data.user;
    posts.forEach(post => {
      load_post(post, user);
    });

    
    // for post navs
    let previousBtn = document.createElement("div");
    let nextBtn = document.createElement("div");
    

    if (data.previous === true) {
      previousBtn.setAttribute("class", "page-item ")
      previousBtn.innerHTML = `<a class="nav-index" href="#">Previous</a>`
      previousBtn.addEventListener("click", event => {
        event.preventDefault();
        load_posts(postnm, pgno-1);
      });
    }
    else if (data.previous == false) {
      previousBtn.setAttribute("class", "page-item disabled-item ")
      previousBtn.innerHTML = `<a class="nav-index" href="#">Previous</a>`
    }

    if (data.next === true) {
      nextBtn.setAttribute("class", "page-item")
      nextBtn.innerHTML = `<a class="nav-index" href="#">Next</a>`
      nextBtn.addEventListener("click", event => {
        event.preventDefault();
        load_posts(postnm, pgno+1);
      });
    }
    else if (data.next === false) {
      nextBtn.setAttribute("class", "page-item disabled-item ")
      nextBtn.innerHTML = `<a class="nav-index" href="#">Next</a>`
    }

    document.querySelector("#page-nav").innerHTML = "";
    document.querySelector("#page-nav").append(previousBtn);
    for (let i = 1; i <= data.pagecount; i++) {
      const newBtn = document.createElement("div");
      newBtn.addEventListener("click", event => {
        event.preventDefault();
        load_posts(postnm, i);
        newBtn.removeAttribute("class");
      });

      if (pgno == i)
        newBtn.setAttribute("class", "page-item activ-item");
      else
        newBtn.setAttribute("class", "page-item");
      newBtn.innerHTML = `<a class="nav-index" href="#">${ i }</a>`
      document.querySelector("#page-nav").appendChild(newBtn);
    }
    document.querySelector("#page-nav").appendChild(nextBtn);
  })
}

function edit_post(post, user) {
    // create a text area to edit the post
    const text = document.createElement("textarea");
    text.setAttribute("id", `edit-text${post.id}`);
    text.setAttribute("class", `post-text`);
    text.innerHTML = `${post.text}`;
    document.querySelector(`#post${ post.id }-body`).innerHTML = "";
    document.querySelector(`#post${ post.id }-body`).append(text);

    // change edit btn to save btn
    const saveBtn = document.createElement("button");
    saveBtn.setAttribute("id", "saveBtn");
    saveBtn.setAttribute("class", "post-btn");
    saveBtn.innerHTML = "Save";
    saveBtn.addEventListener("click", event => {
        event.preventDefault();
      
        fetch(`/post/id=${ post.id }/1`, {
            method: 'PUT',
            body: JSON.stringify({
            newtext: document.querySelector(`#edit-text${post.id}`).value,
            post: post
            })
        })
        .then(response =>  response.json())
        .then(data => {
          if (data.status === "Done") {
            const newpost = data.post 
            const user = data.user;
            // edit here
            load_post(newpost, user);
          }
          else {
            console.log(data);
          }
        });
    });
    const postBtnBox = document.querySelector(`#post-btn-box${ post.id }`);
    postBtnBox.innerHTML = "";
    postBtnBox.append(saveBtn);
}

function load_post(post, user) {
  // for post container
  const postViewBox = document.createElement("div");
  const postView = document.createElement("div");
  
  postViewBox.setAttribute("id", `post-view-${ post.id }`);
  postView.setAttribute("class", "posts-view");
  postView.setAttribute("id", `post-${ post.id }`);
  
  // for reloading the body after editing the post
  if (document.getElementById(`post${ post.id }-body`) != null)
    document.querySelector(`#post${ post.id }-body`).innerHTML = "";

  // inside view of the post
  postView.innerHTML = `
      <div class="post-view-top" >
        <div class="user">
          <a href="/profile/${ post.poster }"><strong>${ post.poster }</strong></a>
        </div>
        <div class="post-time">${ post.time }</div>
      </div>
      <div class="post-body" id="post${ post.id }-body"><p>${ post.text }</p></div>
      <div class="post-boxes">
        <div class="like-btn-box" id="like-btn-box${ post.id }"></div>
        <div class="post-btn-box" id="post-btn-box${ post.id }"></div>
      </div>
  ` 
  postViewBox.appendChild(postView);
  if (document.getElementById(`post-view-${ post.id }`) === null) {
    document.querySelector("#posts-view-container").appendChild(postViewBox);
  }
  else {
    document.querySelector(`#post-view-${ post.id }`).innerHTML = "";
    document.querySelector(`#post-view-${ post.id }`).append(postView);
  }

  // for like button
  like_post(post, user);
  
  // for edit and save button
  edit_btn(post, user);

  
}

function edit_btn(post, user) {
  if (user === post.poster) {
    const editBtn = document.createElement("button");
    editBtn.setAttribute("id", "edit-btn");
    editBtn.setAttribute("class", `post-btn`);
    editBtn.innerHTML = "Edit";
    editBtn.addEventListener("click", event => {
        event.preventDefault();
        edit_post(post, user);
    });
    const postBtnBox = document.getElementById(`post-btn-box${ post.id }`);
    if (postBtnBox !== null)
      postBtnBox.append(editBtn);
  }
}

function like_post(post, user) {
  // like btn layout
  const likeBtn = document.createElement("button");
  likeBtn.setAttribute("id", `like-${ post.id }`);
  likeBtn.setAttribute("class", `like`);
  fetch("/like", {
    method: 'POST',
    body: JSON.stringify({
      post: post,
      user: user
    })
  })
  .then(response => response.json())
  .then(liked => {
    if (liked.liked) {
        likeBtn.innerHTML = "Unlike";
    }
    else {
        likeBtn.innerHTML = "Like";
    }

    likeBtn.addEventListener("click", event => {
      event.preventDefault();
      // put request to add like or remove like
      fetch("/like", {
        method: 'PUT',
        body: JSON.stringify({
          post: post,
          user: user
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result.liked);
        likeBtn.innerHTML = "";
        if (result.liked === true) {
          likeBtn.innerHTML = "Unlike";
        }
        else if (result.liked === false) {
          likeBtn.innerHTML = "Like";
        }
      })
    });
    const likeBtnBox = document.getElementById(`like-btn-box${ post.id }`);
    likeBtnBox.append(likeBtn);
  })
}