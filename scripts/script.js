

// Responsible for selecting an element from a document by using a CSS selector

let selectBtn = document.querySelector('.select-btn');
items = document.querySelectorAll(".item");

// console.log(select-btn,items) delete after checking

// Responsible to attach an click (event handler) to an dropdown icon( element.) 
selectBtn.addEventListener("click", () => {
  selectBtn.classList.toggle("open");
});

// Responsible for the multi-select checkboxes, to select plants on care difficulty

// Responsible to get the checkbox 
let plantsCards = document.querySelectorAll(".card-plant") 
let easyCheckbox = document.querySelector('input.easy-checkbox')
let hardCheckbox = document.querySelector('input.hard-checkbox')

console.log(plantsCards,easyCheckbox,hardCheckbox)

checkboxEasy.addEventListener("change", () => {
 plants.forEach(plant => {  
    if(plant.classList.contains("easy")) { 
        plant.classList.toggle("active"); 
         }
         }) 
        })
         
checkboxHard.addEventListener("change", () => { 
   plants.forEach(plant => {   
    if(plant.classList.contains("hard")) {      
        plant.classList.toggle("active");    
      } }) 
    }) 





// const plants = document.querySelectorAll('.card-plant')
// // console.log(plants)
// easyFilter.addEventListener('change', () => {
//   plants.forEach(plant => {
//     if (plant.classList.contains('easy')) 
//     {
//       easyFilter.checked ? plant.style.display = 'block' : plant.style.display ='none';
//     }
//   })
// })

// hardFilter.addEventListener('change', () => {
//   const card = document.getElementsByClassName('hard');
//   if (this.checked) {
//     card.forEach(Card => card.style.display = 'block');
//   } else {
//     card.forEach(Card => card.style.display = 'none');
//   }
// });

  









  
 



