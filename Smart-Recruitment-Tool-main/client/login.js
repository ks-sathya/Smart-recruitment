
const form = document.querySelector("form");
eField = form.querySelector(".email"),
eInput = eField.querySelector("input"),
pField = form.querySelector(".password"),
pInput = pField.querySelector("input");
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
form.onsubmit = (e)=>{
  e.preventDefault(); 
  (eInput.value == "") ? eField.classList.add("shake", "error") : checkEmail();
  (pInput.value == "") ? pField.classList.add("shake", "error") : checkPass();

  setTimeout(()=>{ 
    eField.classList.remove("shake");
    pField.classList.remove("shake");
  }, 500);

  eInput.onkeyup = ()=>{checkEmail();} 
  pInput.onkeyup = ()=>{checkPass();} 

  function checkEmail(){ 
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; 
    if(!eInput.value.match(pattern)){ 
      eField.classList.add("error");
      eField.classList.remove("valid");
      let errorTxt = eField.querySelector(".error-txt");
      
      (eInput.value != "") ? errorTxt.innerText = "Enter a valid email address, it must contain '@' and '.com' at the end" : errorTxt.innerText = "Email can't be blank";
    }else{ 
      eField.classList.remove("error");
      eField.classList.add("valid");
    }
  }

  function checkPass(){ 
    let pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(!pInput.value.match(pattern)){ 
      pField.classList.add("error");
      pField.classList.remove("valid");
      let errorTxt = pField.querySelector(".error-txt");
      
      (pInput.value != "") ? errorTxt.innerText = "It must be atleast 8 characters long, contain a capital letter & a special character !@#$%^&*" : errorTxt.innerText = "Password can't be blank";
    }else{ 
      pField.classList.remove("error");
      pField.classList.add("valid");
    }
  }

  if(!eField.classList.contains("error") && !pField.classList.contains("error")){
    //window.location.href = form.getAttribute("action");
    displaySuccessMessage(); 
  }
}
function displaySuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.innerText = 'Logged in successfully!';
  
    // Append the success message to the document
    document.body.appendChild(successMessage);
  
    // Optionally, you can remove the success message after a certain duration
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000); // Adjust the duration as needed
  }
  const passwordInput = document.getElementById('passwordInput');
  const eyeIcon = document.getElementById('eye-icon');
  
  // Function to toggle password visibility
  function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
  
    // Toggle the eye icon class for visual feedback
    eyeIcon.classList.toggle('fa-eye-slash');
  }
  
  // Update the checkPass function to show/hide the error message
  function checkPass() {
    let pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordInput.value.match(pattern)) {
      pField.classList.add("error");
      pField.classList.remove("valid");
      let errorTxt = document.getElementById('passwordError');
  
      (passwordInput.value != "") ? errorTxt.innerText = "It must be at least 8 characters long, contain a capital letter & a special character !@#$%^&*" : errorTxt.innerText = "Password can't be blank";
    } else {
      pField.classList.remove("error");
      pField.classList.add("valid");
      document.getElementById('passwordError').innerText = ''; // Clear the error message
    }
  }
  togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});