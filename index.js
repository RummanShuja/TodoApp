document.addEventListener("DOMContentLoaded", ()=>{
    //local storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let tasksCompleted = JSON.parse(localStorage.getItem("tasksCompleted")) || [];
    let filteredTasks = tasks;
    let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    //task todo
    let btn = document.querySelector("#button-addon2");
    let inp = document.querySelector("#inp");
    let list = document.querySelector("#task-list")
    let clearAll = document.querySelector(".clearAll");
    let confirmationBox = document.getElementById("confirmationBox");
    let cancelBtn = document.getElementById("cancelBtn");
    let confirmBtn = document.getElementById("confirmBtn");
    let flag = false;

    //search
    let search = document.querySelector("#search");

    //dark mode
    let toggle = document.querySelector(".toggle");
    // let darkMode = false;
    
    //dark mode (default from the local storage) (irrespective of the page)
    if(darkMode){
        toggle.classList.remove("fa-toggle-off");
        toggle.classList.add("fa-toggle-on");
        document.body.classList.add("darkMode");
    }
    else{
        toggle.classList.remove("fa-toggle-on");
        toggle.classList.add("fa-toggle-off");
        document.body.classList.remove("darkMode");
    }


    if(list){
        
        
        function debounce(func,delay) {
            let timer;
            return function(...args){
                clearTimeout(timer);
                timer = setTimeout(()=>{
                    func.apply(this,args);
                },delay);
            };
        }
        
        let filterr = ()=>{
            let searchTerm = search.value.trim().toLowerCase();
            if(searchTerm==""){
                filteredTasks = tasks;
            }
            else{
                filteredTasks = tasks.filter(task=>
                    task.toLowerCase().includes(searchTerm)
                );
            }
            
        }

        function searchHandle(){
            filterr();
            displayTask();
        }

        function displayTask(){
            search.addEventListener("input", debounce(searchHandle,300));

            list.innerHTML="";

            filteredTasks.forEach((task) => {
                let index = tasks.findIndex(element=> element==task);

                let itemContainer = document.createElement("li");
                itemContainer.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                list.appendChild(itemContainer);
        
                // Task Text
                let item = document.createElement("span");
                item.classList.add("w-75");
                item.innerText = task;
                itemContainer.appendChild(item);
        
                // Buttons (done and delete) with spacing
                let isDone = document.createElement("button");
                isDone.innerHTML = '<i class="fa-solid fa-check"></i>';
                isDone.classList.add("btn", "btn-warning", "btn-sm", "ml-2");
        
                let edit = document.createElement("button");
                edit.innerText = "Edit";
                edit.classList.add("btn", "btn-info", "btn-sm", "ml-2");

                let delBtn = document.createElement("button");
                delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
                delBtn.classList.add("btn", "btn-danger", "btn-sm", "ml-2");
        
                // Append buttons to itemContainer directly
                itemContainer.appendChild(isDone);
                itemContainer.appendChild(edit);
                itemContainer.appendChild(delBtn);
        
                isDone.addEventListener("click",()=>{
                    let temp = tasks.splice(index,1);
                    tasksCompleted.push(temp[0]);
                    localStorage.setItem("tasks",JSON.stringify(tasks));
                    localStorage.setItem("tasksCompleted",JSON.stringify(tasksCompleted));
                    filterr();
                    displayTask();
                })        
                
                edit.addEventListener("click",()=>{
                    if(!flag){
                        flag = true;
                        let editContainer = document.createElement("div");
                        let cancelEditBtn = document.createElement("button");
                        let saveEditBtn = document.createElement("button");
                        let inputEdit = document.createElement("input");
                        let btnContainer = document.createElement("div");
    
                        cancelEditBtn.innerText = "Cancel";
                        saveEditBtn.innerText = "Save";
                        editContainer.classList.add("editContainer");
                        btnContainer.classList.add("btnContainer");
                        inputEdit.classList.add("inputEdit");
                        inputEdit.value = task; 
                        saveEditBtn.classList.add("saveEditBtn");
                        cancelEditBtn.classList.add("cancelEditBtn");
                        

                        
                        editContainer.appendChild(inputEdit);
                        btnContainer.appendChild(cancelEditBtn);
                        btnContainer.appendChild(saveEditBtn);
                        editContainer.appendChild(btnContainer);
    
                        saveEditBtn.addEventListener("click", ()=>{
                            let input = inputEdit.value.trim();
                            if(input!==""){
                                tasks[index] = input;
                                localStorage.setItem("tasks", JSON.stringify(tasks));
                                filterr();
                                displayTask();
                            }
                            flag=false;
                            editContainer.remove();
                        });
                        cancelEditBtn.addEventListener("click",()=>{
                            flag=false;
                            editContainer.remove();
                        });
                        document.body.appendChild(editContainer);
                    }
                })
                    

                delBtn.addEventListener("click",()=>{
                    tasks.splice(index,1);
                    localStorage.setItem("tasks",JSON.stringify(tasks));
                    filterr();
                    displayTask();
                });
            });
            
            if(tasks.length===0){
                clearAll.style.display = "none";
            }
            else{
                clearAll.style.display = "block"
            }
        }
        filterr();
        displayTask();
    
        btn.addEventListener("click",()=>{
            if(inp.value.trim()!==""){
                tasks.push(inp.value.trim());
                localStorage.setItem("tasks",JSON.stringify(tasks));
                inp.value = "";
                filterr();
                displayTask();
            }
        })
        
        clearAll.addEventListener("click", ()=>{
            confirmationBox.style.display = "block";
        });
        cancelBtn.addEventListener("click", ()=>{
            confirmationBox.style.display = "none";
        });
        confirmBtn.addEventListener("click", ()=>{
            tasks.length=0;
            localStorage.setItem("tasks",JSON.stringify(tasks));
            confirmationBox.style.display = "none";
            filterr();
            displayTask();
        });
    
        //dark mode
        toggle.addEventListener("click",()=>{
            darkMode = ! darkMode;
            toggle.classList.toggle("fa-toggle-off", !darkMode);
            toggle.classList.toggle("fa-toggle-on", darkMode);
            document.body.classList.toggle("darkMode", darkMode);
            localStorage.setItem("darkMode",darkMode);
            displayTask();
        })

    }

  

    //taskCompletedPage
    let completedList = document.querySelector("#completedTask-list");
    let clearAll2 = document.querySelector(".clearAll2");
    let confirmationBox2 = document.getElementById("confirmationBox2");
    let cancelBtn2 = document.getElementById("cancelBtn2");
    let confirmBtn2 = document.getElementById("confirmBtn2");
    
    if(completedList){
        function displayCompletedTask(){
            completedList.innerHTML="";
            tasksCompleted.forEach((task,index)=>{
                
                let item = document.createElement("li");
                item.classList.add("list-group-item", "text-center","text-decoration-line-through");
                item.innerText = task;
                completedList.appendChild(item);
                
            });
            if(tasksCompleted.length===0){
                clearAll2.style.display = "none";
            }
            else{
                clearAll2.style.display = "block";
            }

        }
        displayCompletedTask();
        
        clearAll2.addEventListener("click", ()=>{
            confirmationBox2.style.display = "block";
        
            cancelBtn2.addEventListener("click", ()=>{
                confirmationBox2.style.display = "none";
            });
            
            confirmBtn2.addEventListener("click", ()=>{
                tasksCompleted.length=0;
                localStorage.setItem("tasksCompleted",JSON.stringify(tasksCompleted));
                confirmationBox2.style.display = "none";
                displayCompletedTask();
            })
            
        });
        //dark mode
        toggle.addEventListener("click",()=>{
            darkMode = ! darkMode;
            toggle.classList.toggle("fa-toggle-off", !darkMode);
            toggle.classList.toggle("fa-toggle-on", darkMode);
            document.body.classList.toggle("darkMode", darkMode);
            localStorage.setItem("darkMode",darkMode);
            displayCompletedTask();
        })
    }

    
})





