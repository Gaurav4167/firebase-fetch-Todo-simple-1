var cl = console.log;

const BASE_URL = `https://gaurav-1st-db-default-rtdb.firebaseio.com/`
const TODO_URL = `${BASE_URL}/fetchTodos/.json`

let todosArr = [];

const form = document.getElementById("form")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const clearBtn = document.getElementById("clearBtn")
const todoControl = document.getElementById("todoControl")
const todoContainer = document.getElementById("todoContainer")
const todoLabel = document.getElementById("todoLabel")
const spinner = document.getElementById("spinner")

//===================== CREATE =============================
function createNewTodo(eve) {
    eve.preventDefault();
    let newTodo = {
        todo: todoControl.value
    }
    showSpinner("text-success")
    fetch(TODO_URL, {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
            "Content-type": "Application/json",
            "Autherization": "TOKEN FROM JS"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            newTodo.id = data.name
            todosArr.unshift(newTodo)
            createTodoOnUi(newTodo) //Calling function
            clearForm()
            showSnackBar("Added", "Todo Added successfully", "success")
            hideSpinner("text-success")
        })
        .catch(err => {
            hideSpinner("text-success")
            showSnackBar("Error", err, "error")
        })

}
// Crate todo on UI
function createTodoOnUi(newTodo) {
    cl(newTodo)
    let col = document.createElement("div")
    col.id = newTodo.id
    col.className = "col-12"
    col.innerHTML = `
                             <div class="card mt-3">
                                    <div class="card-body p-2">
                                        <div class="d-flex justify-content-between">
                                            <p class="todo-context"> ${newTodo.todo} </p>
                                            <div>
                                                <i onClick="editTodo(this)" role="button" class="fa-solid fa-pen-to-square p-2 text-primary"></i>
                                                <i onClick="deleteTodo(this)" role="button" class="fa-solid fa-trash ml-3 p-2 text-danger"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             `

    todoContainer.prepend(col)
}
//===================== READ =============================
function fetchTodo(arr) {
    showSpinner("text-primary")
    fetch(TODO_URL, {
        method: "GET",
        body: null
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            for (const key in data) {
                data[key].id = key
                todosArr.unshift(data[key])
            }

            let result = ""
            arr.forEach((ele, i) => {
                result += `<div class="col-12" id=${ele.id}>
                               <div class="card mt-3">
                                    <div class="card-body p-2">
                                        <div class="d-flex justify-content-between">
                                            <p class="todo-context"> ${ele.todo} </p>
                                            <div>
                                                <i onClick="editTodo(this)" role="button" class="fa-solid fa-pen-to-square p-2 text-primary"></i>
                                                <i onClick="deleteTodo(this)" role="button" class="fa-solid fa-trash ml-3 p-2 text-danger"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
            });
            todoContainer.innerHTML = result;
            hideSpinner("text-primary")
        })
        .catch(err => {
            hideSpinner("text-primary")
            showSnackBar("Error", err, "error")
        })
}
fetchTodo(todosArr)
//===================== EDIT =============================
function editTodo(ele) {
    let EDIT_ID = ele.closest(".col-12").id
    let EDIT_URL = `${BASE_URL}/fetchTodos/${EDIT_ID}.json`
    showSpinner("text-success")
    fetch(EDIT_URL, {
        method: "GET",
        body: null
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            localStorage.setItem("EDIT_ID", EDIT_ID);
            todoControl.value = data.todo

            addBtn.classList.add("d-none");
            updateBtn.classList.remove("d-none")

            window.scrollTo({
                top : 0,
                behavior : "smooth"
            })
            
            hideSpinner("text-success")
            todoLabel.innerText = "Update Todo"
        })
        .catch(err => {
            hideSpinner("text-success")
            showSnackBar("Error", err, "error")
        })
}
//===================== UPDATE =============================
function updateTodo(ele) {
    let UPDATE_ID = localStorage.getItem("EDIT_ID")
    let UPDATE_URL = `${BASE_URL}/fetchTodos/${UPDATE_ID}.json`
    let updatedTodo = {
        todo: todoControl.value,
        id: UPDATE_ID
    }
    showSpinner("text-success")
    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(updatedTodo)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })
        .then(data => {
            document.getElementById(UPDATE_ID).innerHTML = `
                                <div class="card mt-3">
                                    <div class="card-body p-2">
                                        <div class="d-flex justify-content-between">
                                            <p class="todo-context"> ${data.todo} </p>
                                            <div>
                                                <i onClick="editTodo(this)" role="button" class="fa-solid fa-pen-to-square p-2 text-primary"></i>
                                                <i onClick="deleteTodo(this)" role="button" class="fa-solid fa-trash ml-3 p-2 text-danger"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>`

            addBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")
            todoLabel.innerText = "Add Todo"
            clearForm()
            hideSpinner("text-success")

            showSnackBar("Updated", "Todo Updated successfully", "success")
        })
        .catch(err => {
            hideSpinner("text-success")
            showSnackBar("Error", err, "error")
        })
}
//===================== DELETE =============================
function deleteTodo(ele) {
    let DELETE_ID = ele.closest(".col-12").id
    let DELETE_URL = `${BASE_URL}/fetchTodos/${DELETE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner("text-danger")
            fetch(DELETE_URL, {
                method: "DELETE",
                body: null
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP Error : ${res.status}`)
                    }
                    return res.json()
                })
                .then(data => {
                    let getIndex = todosArr.findIndex(ele => ele.id === DELETE_ID)
                    todosArr.splice(getIndex, 1)
                    ele.closest(".col-12").remove()
                    hideSpinner("text-danger")
                    showSnackBar("Removed", "Todo Removed successfully", "success")
                })
                .catch(err => {
                    hideSpinner("text-danger")
                    showSnackBar("Error", err, "error")
                })
        }
    });

}
function showSnackBar(title, msg, icon) {
    Swal.fire({
        title: title,
        text: msg,
        icon: icon
    });
}
function clearForm() {
    form.reset()
}
function showSpinner(color){
    spinner.classList.remove("d-none")
    spinner.classList.add(color)
}
function hideSpinner(color){
    spinner.classList.add("d-none")
    spinner.classList.remove(color)
}
form.addEventListener("submit", createNewTodo)
updateBtn.addEventListener("click", updateTodo)




























