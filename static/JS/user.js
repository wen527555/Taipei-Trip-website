"use strict";

const overlay = document.querySelector(".overlay");
const btnCloseModel = document.querySelectorAll(".btn_close_model");
const btnOpenSignInFrom = document.getElementById("nav_signin");
const btnSignOut = document.getElementById("nav_register");
const signInModel = document.getElementById("model_signIn");
const registerModel = document.querySelector(".model_register");
const registerLink = document.getElementById("showRegisterForm");
const signInLink = document.getElementById("showLogInForm");

const logIn_email = document.getElementById("logIn_email");
const logIn_password = document.getElementById("logIn_password");

const register_email = document.getElementById("register_email");
const register_password = document.getElementById("register_password");
const register_name = document.getElementById("register_name");

function clear_all() {
  register_name.value === "";
  register_email.value === "";
  register_password.value === "";
  logIn_email.value === "";
  logIn_password.value === "";
  signInMsg.value === "";
  registerMsg.value === "";
  registerMsg.style.display = "none";
  hasMsg = false;
}

//model
const turnToRegister = function () {
  signInModel.classList.remove("show");
  registerModel.classList.add("show");
};

const turnToSignIn = function () {
  registerModel.classList.remove("show");
  signInModel.classList.add("show");
};

const closeModel = function () {
  signInModel.classList.remove("show");
  registerModel.classList.remove("show");
  overlay.classList.remove("show");
  clear_all();
};

const openSignInFrom = function () {
  signInModel.classList.add("show");
  overlay.classList.add("show");
};

registerLink.addEventListener("click", turnToRegister);
signInLink.addEventListener("click", turnToSignIn);
btnCloseModel.forEach((btn) => btn.addEventListener("click", closeModel));
overlay.addEventListener("click", closeModel);
btnOpenSignInFrom.addEventListener("click", openSignInFrom);

const registerBtn = document.getElementById("register_button");
const registerMsg = document.querySelector(".registerMsg");

let hasMsg = false;

//??????????????????
function registerSystem() {
  if (
    register_name.value === "" ||
    register_email.value === "" ||
    register_password.value === ""
  ) {
    registerMsg.style.display = "block";
    registerMsg.textContent = "???????????????????????????????????????";
  } else {
    fetch(`/api/user`, {
      method: "POST",
      body: JSON.stringify({
        name: register_name.value,
        email: register_email.value,
        password: register_password.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["ok"]) {
          registerMsg.style.display = "block";
          registerMsg.textContent = "???????????????";
          hasMsg = true;
        } else {
          registerMsg.style.display = "block";
          registerMsg.textContent = data["message"];
          hasMsg = true;
        }
      })
      .catch((error) => console.log(error));
  }
}
registerBtn.addEventListener("click", registerSystem);

//??????????????????
const signInBtn = document.getElementById("signIn_button");
const signInMsg = document.querySelector(".signInMsg");
// const token = localStorage.getItem("access_token");
// localStorage.setItem("access_token", token);

function logInSystem() {
  fetch(`/api/user/auth`, {
    method: "PUT",
    body: JSON.stringify({
      email: logIn_email.value,
      password: logIn_password.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data["ok"]) {
        // console.log("????????????");
        // signInMsg.style.display = "block";
        // signInMsg.textContent = "????????????";

        location.reload();
      } else {
        signInMsg.style.display = "block";
        signInMsg.textContent = data["message"];
        hasMsg = true;
      }
    })
    .catch((error) => console.log(error));
}

signInBtn.addEventListener("click", logInSystem);

//????????????
const logOutUser = btnSignOut.addEventListener("click", () => {
  fetch(`/api/user/auth`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data["ok"]) {
        btnSignOut.classList.remove("show");
        btnOpenSignInFrom.classList.remove("show");
        window.location.reload();
      } else {
        console.log("????????????");
      }
    })
    .catch((error) => console.log(error));
});

//????????????cookie?????????;
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

//????????????
function getCurrentUser() {
  const token = getCookie("access_token");
  if (!token) {
    btnSignOut.style.display = "none";
    btnOpenSignInFrom.style.display = "block";
  }
  fetch(`/api/user/auth`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("API????????????:" + response.status);
      }
    })
    .then((data) => {
      console.log(data["data"]);
      if (data["data"] != null) {
        btnSignOut.style.display = "block";
        btnOpenSignInFrom.style.display = "none";
      } else {
        btnSignOut.style.display = "none";
        btnOpenSignInFrom.style.display = "block";
      }
    })
    .catch((error) => {
      // console.log(error);
      console.log("API????????????:" + error.message);
    });
}
getCurrentUser();
// window.addEventListener("load", getCurrentUser);
