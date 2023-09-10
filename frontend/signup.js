// signup variables
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("my-form");
const signupFail = document.getElementById("signupFail");

//login variables

form.addEventListener("submit", (e) => {
  e.preventDefault();

  axios({
    method: "post",
    url: "http://localhost:5000/signup",
    data: {
      name: name.value,
      email: email.value,
      password: password.value,
    },
  }).then((data) => {
    // console.log(data)
    form.reset();
    if (!data.data.success) {
      signupFail.textContent = "User already registered";
    } else {
      signupFail.textContent = "Welcome aboard ";
      signupFail.style.color = "green";
    }
  });
});
