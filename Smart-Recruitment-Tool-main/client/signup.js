const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelector(".firstNext");
const prevBtnSec = document.querySelector(".prev-1");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const prevBtnFourth = document.querySelector(".prev-3");
const submitBtn = document.querySelector(".submit");
const progressText = document.querySelectorAll(".step p");
const progressCheck = document.querySelectorAll(".step .check");
const bullet = document.querySelectorAll(".step .bullet");
let current = 1;

function validateFields(page) {
  const fields = document.querySelectorAll(`.page:nth-child(${page}) input, .page:nth-child(${page}) select`);
  for (const field of fields) {
    if (field.type !== 'submit' && field.value.trim() === '') {
      return false;
    }
  }
  return true;
}

nextBtnFirst.addEventListener("click", function(event) {
  event.preventDefault();
  if (validateFields(current)) {
    slidePage.style.marginLeft = "-25%";
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;
  } else {
    alert("Please fill out all fields.");
  }
});

nextBtnSec.addEventListener("click", function(event) {
  event.preventDefault();
  if (validateFields(current)) {
    slidePage.style.marginLeft = "-50%";
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;
  } else {
    alert("Please fill out all fields.");
  }
});

nextBtnThird.addEventListener("click", function(event) {
    event.preventDefault();
    if (validateFields(current)) {
      slidePage.style.marginLeft = "-75%";
      bullet[current - 1].classList.add("active");
      progressCheck[current - 1].classList.add("active");
      progressText[current - 1].classList.add("active");
      current += 1;
      const dateInput = document.querySelector('.page:nth-child(3) input[type="date"]');
      const picker = new Litepicker({
        element: dateInput,
        format: 'DD-MM-YYYY', // Change the format as needed
        singleMode: true,
        lang: 'en', // Set language (English in this case)
      });

  
    
    } else {
      alert("Please fill out all fields.");
    }
  
});

function displaySuccessMessage(message) {
  const successMessage = document.createElement('div');
  successMessage.classList.add('success-message');
  successMessage.innerText = message;

  // Append the success message to the document
  document.body.appendChild(successMessage);

  // Optionally, you can remove the success message after a certain duration
  setTimeout(() => {
    document.body.removeChild(successMessage);
  }, 3000); // Adjust the duration as needed
}

submitBtn.addEventListener("click", function () {
  if (validateFields(current)) {
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;

    // Display a success message
    displaySuccessMessage('User Registered You Can Login Now');

    // Navigate to the login page after a delay
    setTimeout(function () {
      // Replace the following line with the code to navigate to the login page
      window.location.href = "login.html";
    }, 4000); // Adjust the delay as needed
  } else {
    alert("Please fill out all fields.");
  }
});


prevBtnSec.addEventListener("click", function(event) {
  event.preventDefault();
  slidePage.style.marginLeft = "0%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});

prevBtnThird.addEventListener("click", function(event) {
  event.preventDefault();
  slidePage.style.marginLeft = "-25%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});

prevBtnFourth.addEventListener("click", function(event) {
  event.preventDefault();
  slidePage.style.marginLeft = "-50%";
  bullet[current - 2].classList.remove("active");
  progressCheck[current - 2].classList.remove("active");
  progressText[current - 2].classList.remove("active");
  current -= 1;
});