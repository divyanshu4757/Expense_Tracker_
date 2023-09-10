const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginForm = document.getElementById('login-form');
const p = document.getElementById('loginStatus');
const forgotButton = document.getElementById('forgot-password');

forgotButton.addEventListener('click', () =>{
  window.location.href = "./forgotpassword.html"; 
})

loginForm.addEventListener('submit',(e)=>{

   e.preventDefault();
  // console.log(loginEmail.value , loginPassword.value)
  
  axios({
    method: "post",
    url: "http://localhost:5000/login",
    data: {
      email: loginEmail.value,
      password: loginPassword.value
    },
  })
  .then(response=>{
        
    const token = response.data.id;
    
        
    if(token){
          p.textContent = "login successful";
          localStorage.setItem('token', token);

        //  p.style.color = 'green';
        //  p.style.fontWeight="bold";
        //  p.style.fontSize ="25px";
        window.location.href = "./expense.html"; 
    }
    
  })
  .catch(error=>{
    
   // p.textContent= error.response.data;
   p.textContent="login failed"
    p.style.color = 'red';
    p.style.fontWeight="bold";
    p.style.fontSize ="25px"

  })

  loginForm.reset();



});




