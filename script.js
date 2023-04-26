const itemForm  = document.getElementById('item-form');
const itemInput  = document.getElementById('item-input');
const itemList  = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => addItemToDOM(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  
  const newItem = itemInput.value;

  //Validate input
  if (newItem === ''){
    alert('Please add an item');
    return;
    }

  //Check For Edit Mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
    } else {
      if (checkIfItemExist(newItem)) {
        alert('That iem already exists!');
        return;
    
    }

  };

  //create item to Dom
  addItemToDOM(newItem);

  //add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}
//add li to the DOM
function addItemToDOM(item){
  //Create List itemForm
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);
  
  //Add li to the DOM
  itemList.appendChild(li);  
}



function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;

}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
  
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  //add new items to array
  itemsFromStorage.push(item);
  //convert to Json String and set to local storage

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else{
    setItemToEdit(e.target);
  }
}

function checkIfItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
  isEditMode = true;

  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#8A2BE2';
  itemInput.value = item.textContent;
}

function removeItem(item){
  if (confirm('Are You Sure')){
    //remove item from DOM
    item.remove();

    //remove item from storage
    removeItemFromStorage(item.textContent)

    checkUI();
  }
}

function removeItemFromStorage(item){
  let itemsFromStorage = getItemsFromStorage();

  //filter out to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //reset to localstorage

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function clearItems(){
while (itemList.firstChild) {
itemList.removeChild(itemList.firstChild);

  //Clear From LocalStorage
  localStorage.removeItem('items');



  checkUI();
}
}

function filterItems(e) {
  const text  = e.target.value;
  const items = itemList.querySelectorAll('li');
  
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
  
    if (itemName.indexOf(text) != -1) {
          item.style.display= 'flex';
    }else{
      item.style.display= 'none';
    }
    });
}


function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else { 
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

//initialize app
function init(){
//Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);
checkUI();
}

init();
