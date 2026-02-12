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

function doLogout()
{
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = "index.html";
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

// ---------------- CONTACT FUNCTIONS ----------------

// ADD CONTACT
function addContact()
{
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    document.getElementById("contactAddResult").innerHTML = "";

    let body = {
        userId,
        firstName,
        lastName,
        phone,
        email,
    };
    const jsonPayload = JSON.stringify(body);

    const url = urlBase + '/addContact.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
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
    const search = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    let contactList = "";
    const body = { search, userId: userId };
    const jsonPayload = JSON.stringify(body);

    const url = urlBase + '/searchContact.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);
                
                const contactListDiv = document.getElementById("contactList")

                if (contactListDiv && jsonObject.results)
                {
                    const numRes = jsonObject.results.length;
                    document.getElementById("contactSearchResult").innerHTML = `Found ${numRes} result${numRes === 1 ? '': 's'}`;

                    for (let i = 0; i < numRes; i++)
                    {
                        let contact = jsonObject.results[i];
                        contactList += `
                        <div class="contact">
                            <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
                            <a class="contact-phone" href="tel:${contact.phone}">
                                <i class="fa-solid fa-phone"></i>
                                ${contact.phone}
                            </a>
                            <a class="contact-email" href="mailto:${contact.email}">
                                <i class="fa-solid fa-envelope"></i>
                                ${contact.email}
                            </a>
                        </div>
                        `
                    }
                    contactListDiv.innerHTML = contactList;
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