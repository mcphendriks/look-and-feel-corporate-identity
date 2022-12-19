

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
const easyFilter = document.getElementById('easy-filter')
const hardFilter = document.getElementById('hard-filter')

console.log(easyFilter,hardFilter)

const plants = document.querySelectorAll('.card-plant')

console.log(plants)

easyFilter.addEventListener('change', () => {
  plants.forEach(plant => {
    if (plant.classlist.contains('easy')) 
    {
      plant.style.display = 
      easyFilter.checked ? 'block' : 'none';
    }
  })
})

hardFilter.addEventListener('change', () => {
  plants.forEach(plant => {
    if (plant.classlist.contains('hard'))
    {
      plant.style.display =
      hardFilter.checked ? 'block' : 'none'
    }
  } )
})









  
 



