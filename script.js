// Variable initialisation 

const openTaskFormBtn = document.getElementById("open-task-form-btn");
const taskInput = document.getElementById("task-input");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const taskContainer = document.getElementById("task-container");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");



// Arrays, Objects and Containers

// a raw collection of all tasks loaded from localStorage or will create empty array if data in localStorage does not exist
const allTasks = JSON.parse(localStorage.getItem("data")) || [];

// an object we use when we are working and/or modifying an existing task
let currentTask = {};


// Helper function to toggle the hidden class on Element,ents to make them visible or not
const toggleHide = () => {
  taskInput.classList.toggle("hidden");
  openTaskFormBtn.classList.toggle("hidden");
  reset();

}


const addOrUpdateTask = () => {

  // A record of what the user has just inputted

  const taskObj = {
id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
title: titleInput.value,
date: dateInput.value,
description: descriptionInput.value
  };

  // checking to see if there is an existing item that has the same ID as one that exists and is stored in currentTask

  const dataArrIndex = allTasks.findIndex((item)=>{item.id === currentTask.id})

  // if there is no matching item ID and currentTask ID it means its a new entry which we are adding to the front of our array

  if (dataArrIndex === -1) {
    allTasks.unshift(taskObj)
  }
// if there is a match it means the task already exists, and we want to save over the existing element in the array with the new inputs saved in the taskObj
  else {
    allTasks[dataArrIndex] = taskObj
  }
  localStorage.setItem("data", JSON.stringify(allTasks));
  updateTaskContainer();
  reset();
};


const updateTaskContainer = () => {

  taskContainer.innerHTML = "";

  allTasks.forEach(({id, title, date, description})=>{
    taskContainer.innerHTML +=
    `
  <div class="task" id=${id}>
  <p><strong>Title: </strong>${title}</p>
  <p><strong>Date: </strong>${date}</p>
  <p><strong>Description: </strong>${description}</p>
  <button class="btn-sm" onclick="editTask(this)">Edit</button>
  <button class="btn-sm" onclick="deleteTask(this)">Delete</button>
  </div>
    
    `
  })
}


const editTask = (buttonEl) => {
toggleHide();

const dataArrIndex = allTasks.findIndex((item)=>item.id === buttonEl.parentElement.id);

  currentTask = allTasks[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

}

const deleteTask = (buttonEl) =>{

  const dataArrIndex = allTasks.findIndex((item)=>item.id === buttonEl.parentElement.id);
  allTasks.splice(dataArrIndex, 1);
  buttonEl.parentElement.remove();
  localStorage.setItem("data", JSON.stringify(allTasks));

}


const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  currentTask = {};
}

// If there are tasks that have been created, make dure to display them

if (allTasks.length){
  updateTaskContainer();
}


const openModal = () => {

  const inputContainsValues = titleInput.value || dateInput.value || descriptionInput.value;
  const inputValuesMatch = currentTask.title !== titleInput.value || currentTask.date !== dateInput.value || currentTask.description !== descriptionInput.value;

  if ( inputContainsValues && inputValuesMatch ) {
    confirmCloseDialog.showModal();
    document.body.classList.toggle("no-scroll");
  } else {
    toggleHide();
  };

};

// Event Listeners

openTaskFormBtn.addEventListener("click", toggleHide);

closeTaskFormBtn.addEventListener("click", () => {
  openModal();
});

taskInput.addEventListener("submit", (e)=> {
e.preventDefault();
addOrUpdateTask();
toggleHide();
})

cancelBtn.addEventListener("click", ()=>{
document.body.classList.toggle("no-scroll");
})

discardBtn.addEventListener("click", ()=>{
  toggleHide();
  document.body.classList.toggle("no-scroll");
})