import { load_posts } from "/static/network/main.js";

document.addEventListener("DOMContentLoaded", function(){
    let user = document.querySelector("#prof-name").innerHTML;
    
    // loads post of the user whose profile is being viewed
    load_posts(`user=${ user }`, 1);

    follow(user);
});

function follow(user) {
  fetch("/follow/" + user)
  .then(response => response.json())
  .then(follow => {
    if (follow.followed !== "same") {
      let followBtn = document.createElement("button");
      followBtn.setAttribute("id", "follow-btn");
      document.querySelector("#follow-btn-box").innerHTML = '';
      document.querySelector("#follow-btn-box").appendChild(followBtn);
      followBtn.addEventListener("click", event => {
        event.preventDefault();
        send_follow(user);
      });
      if (follow.followed === "true") {
        document.querySelector("#follow-btn").innerHTML = "Unfollow";
      }
      else {
        document.querySelector("#follow-btn").innerHTML = 'Follow';
      }    
    }
  })
}

function send_follow(user) {
  fetch("/follow/" + user, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(follow => {
    if (follow.followed !== "same") {
      if (follow.followed === "true") {
        document.querySelector("#follow-btn").innerHTML = "Unfollow";
      }
      else {
        document.querySelector("#follow-btn").innerHTML = 'Follow';
      } 
    }
  })
}
