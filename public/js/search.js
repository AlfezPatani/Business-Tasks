
const searchInputField = document.getElementById('searchQuery');
const searchByIdBtn = document.getElementById('ById');
const searchByNameBtn = document.getElementById('ByName');
const searchByPhoneBtn=document.getElementById('ByPhone');
const searchResultContainer = document.querySelector('.SearchResult');

let searchString = '';
let seaching=false;

searchInputField.addEventListener('focusin', () => {
    searchResultContainer.style.display = "none"
})

searchInputField.addEventListener('input', (e) => {
    searchString = e.target.value;
})

searchByNameBtn.addEventListener('click', async () => {
    try {
        if(seaching){
            alert('we are searching, please wait..');
            return
        }
        seaching=true;
        searchResultContainer.innerHTML="";
        const res = await fetch(`/api/clients/${searchString}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        seaching=false;
        const data = await res.json();
        if (res.status !== 200) {
            searchResultContainer.style.display = "flex";
            searchResultContainer.innerHTML = "client dosn't exist or internal server error";
            return
        }
        
        searchResultContainer.style.display = "flex";
        data.forEach((client) => {

            const html = `<a href='/client.html?id=${client.clientId}'>${client.name}</a>`
            searchResultContainer.insertAdjacentHTML('beforeend', html);
        });

    } catch (error) {
        console.log(error);
        alert('unexpacted error occured while searching');
        
        seaching=false;

    }
})

searchByIdBtn.addEventListener('click', async () => {
    try {
        if(seaching){
            alert('we are searching, please wait..');
            return
        }
        seaching=true;
        searchResultContainer.innerHTML="";
        if (!searchString) {
            return alert('please enter client id');
        }
        const res = await fetch(`/api/clients/${searchString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        seaching=false;

        const client = await res.json();
        if (client.message) {
            return alert(client.message);
        }
        const html = `<a href='/client.html?id=${client.clientId}'>${client.name}</a>`
        searchResultContainer.insertAdjacentHTML('beforeend', html)
        searchResultContainer.style.display = "flex";

    } catch (error) {
        
        alert('unexpacted error occured while searching');
        seaching=false;
        console.log(seaching);
        
        console.log(error);
    }
})

searchByPhoneBtn.addEventListener('click', async () => {
    try {
        if(seaching){
            alert('we are searching, please wait..');
            return
        }
        seaching=true;
        searchResultContainer.innerHTML="";
        if (!(/^\d{10}$/.test(searchString))) {
            return alert('phone number is invalid');
        }
        const res = await fetch(`/api/clients/${searchString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        seaching=false;

        const client = await res.json();
        if (client.message) {
            return alert(client.message)
        }
        const html = `<a href='/client.html?id=${client.clientId}'>${client.name}</a>`
        searchResultContainer.insertAdjacentHTML('beforeend', html)
        searchResultContainer.style.display = "flex";

    } catch (error) {
        alert('unexpacted error occured while searching');
        console.log(error);
        seaching=false;

    }
})

