const form = document.getElementById('forgot-form');
const email = document.getElementById('email');
const message = document.getElementById('message');
form.addEventListener('submit',(e)=>{
 
    e.preventDefault();
    

    axios({
        method: "post",
        url: "http://localhost:5000/password/forgotpassword",
        data: {
         email: email.value,
        },
       
      })
      .then(result=>{

        if(result.status==200){
          message.textContent = 'An email has been sent to you'
          form.style.display="none"
        }
      })
      .catch(error=>{
        console.log(error)
        message.textContent = "Account not found";
      })
form.reset();
      
})