

let ClientContainer = document.querySelector('.ClientContainer');



async function getAll() {
    const res = await fetch('/api/clients');
    const data = await res.json();
    if(data.length<=0){
        const Text= document.createElement('p');
            Text.innerHTML="sorry clients doesn't exist";
            Text.style.color="white"
        ClientContainer.appendChild(Text);
    }
    for (const d of data) {
        const client = document.createElement('div');
        const clientInfo = document.createElement('div');
        const modificationBtns = document.createElement('div');

        //modification btns
        const seeMore = document.createElement('a');
        seeMore.setAttribute('href',`/client.html?id=${d.clientId}`);
        seeMore.innerText = 'see More';
        seeMore.classList.add('MoreInfo');

        const deleteBtn = document.createElement('div');
        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add('DelBtn');
        deleteBtn.addEventListener('click', async () => {
            const res =await fetch(`/api/clients/${d.clientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = await res.json();
            alert(`${data.message} id:${data?.client?.clientId}`);
            deleteBtn.parentElement.parentElement.remove();
        })


        modificationBtns.classList.add('ModificationBtns');
        modificationBtns.appendChild(seeMore);
        modificationBtns.appendChild(deleteBtn);

        //client info
        clientInfo.classList.add('ClientInfo');
        const id = document.createElement('span');
        id.classList.add('ClientId');
        id.innerText = d.clientId;
        
        const name = document.createElement('span');
        name.classList.add('ClientName');
        name.innerText = d.name;

        const address = document.createElement('span');
        address.classList.add('ClientAddress');
        address.innerText = d.address;

        clientInfo.appendChild(id);
        clientInfo.appendChild(name);
        clientInfo.appendChild(address);

        //appen client
        client.classList.add('Client');
        client.appendChild(clientInfo);
        client.appendChild(modificationBtns);

        ClientContainer.appendChild(client);
    }

};

getAll()
