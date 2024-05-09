
const searchInputField = document.getElementById('searchQuery');
const searchByIdBtn = document.getElementById('ById');
const searchByNameBtn = document.getElementById('ByName');
const searchResultContainer = document.querySelector('.SearchResult');

let searchString = '';



searchInputField.addEventListener('focusin', () => {
    searchResultContainer.style.display = "none"
})

searchInputField.addEventListener('input', (e) => {
    searchString = e.target.value;
})

searchByNameBtn.addEventListener('click', async () => {
    try {
        searchResultContainer.innerHTML="";
        const res = await fetch(`/api/clients/${searchString}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json();
        console.log(data);
        if (res.status !== 200) {
            searchResultContainer.style.display = "flex";
            searchResultContainer.innerHTML = "client dosn't exist or internal server error";
            console.log('empty');
            return
        }
        
        searchResultContainer.style.display = "flex";
        data.forEach((client) => {

            const html = `<a href='/client.html?id=${client.clientId}'>${client.name}</a>`
            searchResultContainer.insertAdjacentHTML('beforeend', html);
        });

    } catch (error) {
        console.log(error);
    }
})

searchByIdBtn.addEventListener('click', async () => {
    try {
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
        const client = await res.json();
        if (client.message) {
            return alert(client.message)
        }
        const html = `<a href='/client.html?id=${client.clientId}'>${client.name}</a>`
        searchResultContainer.insertAdjacentHTML('beforeend', html)
        searchResultContainer.style.display = "flex"
    } catch (error) {
        console.log(error);
    }
})

