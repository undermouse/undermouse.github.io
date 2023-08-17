
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const d = new Date();
const today = document.getElementById('today');
const startDate = new Date(2023,07,03,0,0,0);
const cont = document.getElementById('timer');
let i = 1;

today.innerHTML = `Today is: ${d.toString().slice(8, 10)} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
setInterval(() => {
    
    let delta = d - startDate;
    let deltaInDays = Math.floor(delta / 1000 / 60 / 60 / 24);
    let deltaInHours = Math.floor(delta / 1000 / 60 / 60);
    let deltaInMinutes = Math.floor(delta / 1000 / 60);
    let deltaInSeconds = Math.floor(delta / 1000);


    cont.innerHTML = (
        `${numberWithCommas(deltaInDays)} days with no drinks ${'<br>'}
        ${numberWithCommas(deltaInHours)} hours ${'<br>'}
        ${numberWithCommas(deltaInMinutes)} minutes ${'<br>'}
        ${numberWithCommas(deltaInSeconds + i)} seconds
 `);

    i++;

}, 1000);


    

 

  





