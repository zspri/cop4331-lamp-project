const urlBase = 'https://cop4331lamp.zachspri.ng/backend';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// ---------------- LOGIN ----------------

function doLogin()
{
    userId = 0;
    firstName = "";
    lastName = "";
    
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);
    
    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.success && jsonObject.data) 
                {
                    userId = jsonObject.data.userId;
                    firstName = jsonObject.data.firstName;
                    lastName = jsonObject.data.lastName;

                    saveCookie();
                    window.location.href = "color.html"; // keep your redirect
                }
                else 
                {
                    document.getElementById("loginResult").innerHTML = jsonObject.message || "Login failed";
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// ---------------- COOKIE ----------------

function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));

    document.cookie = 
        "firstName=" + firstName + 
        ",lastName=" + lastName + 
        ",userId=" + userId + 
        ";expires=" + date.toGMTString() + ";path=/";
}

function readCookie()
{
    userId = -1;
    let data = document.cookie;

    let entries = data.split(";");

    for (let i = 0; i < entries.length; i++) 
    {
        let entry = entries[i].trim();
        let strips = entry.split(",");

        for (let j = 0; j < strips.length; j++)
        {
            let thisOne = strips[j].trim();
            let tokens = thisOne.split("=");

            if (tokens[0] == "userId")
                userId = parseInt(tokens[1].trim());
            else if (tokens[0] == "firstName")
                firstName = tokens[1];
            else if (tokens[0] == "lastName")
                lastName = tokens[1];
        }
    }

    if (userId < 1)
    {
        window.location.href = "index.html";
    }
    else
    {
        let userNameElement = document.getElementById("userName");
        if (userNameElement)
        {
            userNameElement.innerHTML = "Logged in as " + firstName + " " + lastName;
        }
    }
}

function doLogout()
{
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = "index.html";
}

// ---------------- CONTACT FUNCTIONS ----------------

// ADD CONTACT
function addContact()
{
    // Matches the ID "contactText" in your color.html
    let newContact = document.getElementById("contactText").value;
    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = { contact: newContact, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    // MATCHED TO BACKEND: addContact.php
    let url = urlBase + '/addContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                // Matches the ID "contactAddResult" in your color.html
                document.getElementById("contactAddResult").innerHTML = "Record Commit Successful";
                document.getElementById("contactText").value = ""; 
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

// SEARCH CONTACT
function searchContact()
{
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    let contactList = "";
    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    // MATCHED TO BACKEND: searchContact.php
    let url = urlBase + '/searchContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                // Matches the ID "contactSearchResult" in your color.html
                document.getElementById("contactSearchResult").innerHTML = "Dossier Retrieved";
                
                let jsonObject = JSON.parse(xhr.responseText);
                
                // Matches the ID "contactList" in your color.html
                let displayPara = document.getElementById("contactList");

                if (displayPara && jsonObject.results)
                {
                    for (let i = 0; i < jsonObject.results.length; i++)
                    {
                        contactList += jsonObject.results[i];
                        if (i < jsonObject.results.length - 1)
                            contactList += "<br />\r\n";
                    }
                    displayPara.innerHTML = contactList;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}