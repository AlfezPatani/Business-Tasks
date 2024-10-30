
const curUll = window.location.href;
const url = new URL(curUll);
const searchParams = new URLSearchParams(url.search);
const clientId = searchParams.get('id');

const wrapper = document.querySelector('.Wrapper');


async function getClient() {
    const res = await fetch(`/api/clients/${clientId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await res.json();
    if (data.message) {
        const error = `<p style="color: rgb(73, 70, 70); font-size: 2rem;">${data.message}</p>`
        wrapper.insertAdjacentHTML('afterbegin', error)
        return;
    }
    // ------for left side --------
    const html = `
                <div class="ClientLeft">
                    <h2>Tier:${data?.tier}<h2/>
                    <div class="Field">
                        <label>Client ID</label>
                        <input disabled value='${data?.clientId}'>
                    </div> 
                    <div class="Field">
                        <label>Client Name</label>
                        <input disabled value='${data?.name}' id="_name">
                        <div class="ButtonWrapper">
                            <div class="Edit">Edit</div>
                            <div class="Update">Update</div>
                        </div>
                    </div> 
                    <div class="Field">
                        <label>Client Address</label>
                        <input disabled value='${data?.address}' id="_addr">
                        <div class="ButtonWrapper">
                            <div class="Edit">Edit</div>
                            <div class="Update">Update</div>
                        </div>
                    </div> 
    
                </div>
    `
    wrapper.insertAdjacentHTML('afterbegin', html);

    const nameField = document.getElementById('_name');
    const editBtn = nameField.nextElementSibling.querySelector('.Edit');
    const updateBtn = nameField.nextElementSibling.querySelector('.Update');

    //on edit and update name;
    editBtn.addEventListener('click', () => {
        editBtn.classList.add('Hide');
        updateBtn.classList.add('Show');
        nameField.removeAttribute('disabled');
    })

    updateBtn.addEventListener('click', async () => {
        const newName = nameField.value;
        const res = await fetch(`/api/clients/${clientId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        })
        const updatedClient = await res.json();
        if (updatedClient.message) {
            return alert(updatedClient.message);
        }
        alert(`client name update to:${updatedClient.name}`)
        editBtn.classList.remove('Hide');
        updateBtn.classList.remove('Show');
        nameField.setAttribute('disabled', true);

    })

    const addressField = document.getElementById('_addr');
    const addrEditBtn = addressField.nextElementSibling.querySelector('.Edit');

    //on edit and update address
    const addrUpdate = addressField.nextElementSibling.querySelector('.Update');
    addrEditBtn.addEventListener('click', () => {
        addrEditBtn.classList.add('Hide');
        addrUpdate.classList.add('Show');
        addressField.removeAttribute('disabled');
    })

    addrUpdate.addEventListener('click', async () => {
        const newAddress = addressField.value;
        const res = await fetch(`/api/clients/${clientId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newAddress })
        })
        const updatedClient = await res.json();
        if (updatedClient.message) {
            return alert(updatedClient.message);
        }
        alert(`client address update to:${updatedClient?.address}`)
        addrEditBtn.classList.remove('Hide');
        addrUpdate.classList.remove('Show');
        addressField.setAttribute('disabled', true);

    })


    //----------for right side---------
    const taskListWrapper = document.querySelector('.TaskListWrapper');
    const listHeadings = `<div class="Task">
                        <h2 class="Date ListHeading">Started at</span>
                        <h2 class="Date ListHeading">Ends at </span>
                        <h2 class="Title ListHeading">tasks</span>`
    taskListWrapper.insertAdjacentHTML('beforebegin', listHeadings)
    console.log(data.tasks);

    if (data.tasks) {
        data.tasks.forEach((taskElement, index) => {
            const html = `
                    <div class="Task">
                        <span class="Date">${taskElement.startDate}</span>
                        <span class="Date">${taskElement.endDate}</span>
                        <span class="Title">${taskElement.title}</span>
                        <button _id=${taskElement._id}  class="TaskUPdateBtn">✏️</button>
                        
                        `
            // <button _id=${taskElement._id} class="TaskDelBtn">🗑️</button>
            taskListWrapper.insertAdjacentHTML('afterbegin', html);



        });
        // addDelBttonListener();
        addUpdateTaskBttonListener();


    }

    const addTaskForm = document.querySelector('.AddTask');
    addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addTaskForm);
        formData.append('task', true);
        const dataForSendToServer = {};
        for (const [key, value] of formData) {
            dataForSendToServer[key] = value
        }
        try {
            const res = await fetch(`/api/clients/${clientId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataForSendToServer)
            })
            const newClient = await res.json();
            if (newClient.message) {
                alert(newClient.message);
            }
            console.log(newClient);
            const taskHtml = `<div class="Task">
                            <span class="Date">${newClient.startDate}</span>
                            <span class="Date">${newClient.endDate}</span>
                            <span class="Title">${newClient.title}</span>
                            <button class="TaskUpdateBtn">✏️<button/>
                            
                        </div>`
            taskListWrapper.insertAdjacentHTML('afterbegin', taskHtml);
            // addDelBttonListener();

            alert(`task added to ${clientId}`);

        } catch (error) {
            console.log(error);
        }


    })


}

getClient();

function addUpdateTaskBttonListener() {
    const updateButtons = document.getElementsByClassName('TaskUPdateBtn');

    Array.from(updateButtons).forEach((btn) => {
        const id = btn.getAttribute('_id');
        const titleElement = btn.parentElement.querySelector('.Title');
        btn.addEventListener('click', () => createOverlayForEditTask(id, titleElement.innerText, titleElement));


    })
}

function createOverlayForEditTask(id, taskTitle, taskTitleElement) {
    const overalyContainer = clearOverlayContainer();
    overalyContainer.classList.toggle('Hide');

    //creating overlay
    const overlay = document.createElement('div');
    overlay.classList.add('OverlayForEditTitle');

    //creating content of overlay
    const closeBtn = document.createElement('div');
    closeBtn.classList.add('CloseOverlay');
    closeBtn.innerText = 'X'
    closeBtn.addEventListener('click',closeOverlayContainer)

    const label = document.createElement('label');
    label.innerText = 'Update Task'

    const textArea = document.createElement('textarea');
    textArea.value = taskTitle;

    const updateButton = document.createElement('div');
    updateButton.classList.add('UpdateTitleBtn');
    updateButton.innerText = 'Edit Task';
    updateButton.addEventListener('click', () => updateTask(id, textArea.value, taskTitleElement))

    overlay.append(closeBtn, label, textArea, updateButton);
    overalyContainer.appendChild(overlay);
}

function clearOverlayContainer() {
    const overalyContainer = document.getElementById('OveralyContainer');
    overalyContainer.innerHTML = "";
    return overalyContainer;
}

function closeOverlayContainer(){
    clearOverlayContainer().classList.toggle('Hide');
}

async function updateTask(id, value, element) {
    try {
        if (!value) {
            alert('please enter task');
            return;
        }
        if(!confirm('Do you want to update the task?')){
            return;
        }
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ title: value })
        });
        const data = await res.json();
        if (res.status >= 400) {
            alert(data.message);
            return;
        }
        alert(`your task updated sucessFully:${value}`);
        element.innerText=value;
        closeOverlayContainer();


    } catch (error) {
       alert(error.message);
    }


}

//adding event on taskDel button
function addDelBttonListener() {
    let taskDelButton = document.getElementsByClassName('TaskDelBtn');
    Array.from(taskDelButton).forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('_id')
            deleteTask(id, btn);
        })
    })
}

async function deleteTask(id, ElementToDelete) {
    try {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        if (!res.status == 200) {
            return alert(data?.message);
        }
        const TaskElement = ElementToDelete.parentElement;
        TaskElement.remove();

    } catch (error) {
        console.log(error);
    }
}
