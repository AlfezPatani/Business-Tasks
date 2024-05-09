
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

                    <div class="Field">
                        <label>Client ID</label>
                        <input disabled value=${data?.clientId}>
                    </div> 
                    <div class="Field">
                        <label>Client Name</label>
                        <input disabled value=${data?.name} id="_name">
                        <div class="ButtonWrapper">
                            <div class="Edit">Edit</div>
                            <div class="Update">Update</div>
                        </div>
                    </div> 
                    <div class="Field">
                        <label>Client Address</label>
                        <input disabled value=${data?.address} id="_addr">
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
        alert(`client name update to:${updatedClient.name}`)
        addrEditBtn.classList.remove('Hide');
        addrUpdate.classList.remove('Show');
        addressField.setAttribute('disabled', true);

    })


    //----------for right side---------
    const taskListWrapper = document.querySelector('.TaskListWrapper');

    if (data.tasks) {
        data.tasks.forEach((taskElement) => {
            const html = `
                    <div class="Task">
                        <span class="Date">${taskElement.startDate}</span>
                        <span class="Date">${taskElement.endDate}</span>
                        <span class="Title">${taskElement.title}</span>
                        <button _id=${taskElement._id} class="TaskDelBtn">🗑️</button>
                     </div>
            `
            taskListWrapper.insertAdjacentHTML('afterbegin', html);

        });
        addDelBttonListener();
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
            const taskHtml = `<div class="Task">
                            <span class="Date">${newClient.startDate}</span>
                            <span class="Date">${newClient.endDate}</span>
                            <span class="Title">${newClient.title}</span>
                        </div>`
            taskListWrapper.insertAdjacentHTML('afterbegin', taskHtml);
            alert(`task added to ${clientId}`);
            
        } catch (error) {
            console.log(error);
        }


    })
   

}

getClient()

//adding event on taskDel button

function addDelBttonListener(){
    let taskDelButton=document.getElementsByClassName('TaskDelBtn');
    Array.from(taskDelButton).forEach((btn)=>{
        btn.addEventListener('click',()=>{
            const id=btn.getAttribute('_id')
            deleteTask(id,btn);
        })
    })
}

async function deleteTask(id,ElementToDelete){
    try {
        console.log('inside try----------');
        const res=await fetch(`/api/tasks/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            }});
        const data=await res.json();
        if(!res.status==200){
            return alert(data?.message);
        }
        const TaskElement=ElementToDelete.parentElement;
        TaskElement.remove();
        
    } catch (error) {
        console.log(error);
    }
}
