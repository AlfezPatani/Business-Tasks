const form=document.querySelector('form');
const notification=document.querySelector('.Notification');
const link=notification.querySelector('a');
let isNotified=false;

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    if(isNotified){
            notification.classList.toggle('Show');
            isNotified=false;
            
        }
    const formData=new FormData(form);
    const parsedData={task:{}};
    for([key,value] of formData) {
        if(key==='name' || key==="address" || key==='phone' || key==='tier')
        {
            parsedData[key]=value
            
        }
        else{
            parsedData.task[key]=value;
        }
    }  

    
    try {
        const res=await fetch('/api/clients',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(parsedData)    
        });
        const data= await res.json();
        if(res.status==200){
            console.log(data);
            link.setAttribute('href',`client.html?id=${data?.clientId}`);
            notification.classList.toggle('Show');
            isNotified=true;
            
        }
        else{
            alert(data.message)
        }
    } catch (error) {
        alert(error?.message);
    }

});


// if(!isNotified){
//     notification.classList.toggle('Show');
//     isNotified=true;
//     console.log(true);
// }
// else if(isNotified){
//     notification.classList.toggle('Show');
//     isNotified=false;
//     console.log(false);
// }