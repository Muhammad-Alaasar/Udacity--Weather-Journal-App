/* Global Variables */
const apiURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "182a5c68f679a32ea752a10ed191986f";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();


document.getElementById("generate").addEventListener("click", performAction);

function performAction (e) {
    const feelings = document.getElementById("feelings").value;
    const zipCode = document.getElementById("zip").value;

    getRequest(apiURL, apiKey, zipCode)
    .then(function(data){
        console.log(data)
        postData("/add", { temperature: data.main.temp, date: newDate, userResponse: [zipCode, feelings]})
    }).then(function(){
        updateUI();
    });
}

const getRequest = async (apiURL, apiKey, zipCode) => {
    
    const response = await fetch(apiURL+zipCode+"&units=metric&appid="+apiKey);

    try {
        const data = await response.json();
        console.log(data.main.temp)
        return data
    } catch(error){
        console.log("Error", error)
    }
}

const postData = async (url = "", data = {}) => {
    
    const post = await fetch(url , {
        method:         "POST",
        credentials:    "same-origin",
        headers:         {"Content-Type" : "application/json"},
        body: JSON.stringify(data)
    });
    
    try {
        const newData = await post.json();
        console.log(newData)
        return newData
    } catch(e){
        console.log("Error", e)
    }
}

const updateUI = async () => {

    const projectData = await fetch("/all");
    const allData = await projectData.json();
    console.log(allData)

    try {
        document.getElementById("date").innerHTML = allData.date;
        document.getElementById("temp").innerHTML = Math.round(allData.temperature) + " Degrees";
        document.getElementById("content").innerHTML = allData.userResponse[0] + "<br />" + allData.userResponse[1];

    } catch(e){
        console.log("Error", e)
    }
}