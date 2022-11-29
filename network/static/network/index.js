import { load_posts } from "/static/network/main.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#following").addEventListener("click", event => {
    event.preventDefault();
    load_posts('following', 1);
    document.querySelector("#page-title"). innerHTML = "Following Posts";
  });
  // load all posts by default
  document.querySelector("#page-title"). innerHTML = "All Posts";
  load_posts('all', 1);
});

