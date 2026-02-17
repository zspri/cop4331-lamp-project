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
    
    let loginResultElement = document.getElementById("loginResult");
    loginResultElement.innerHTML = "";
    loginResultElement.className = "";

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

                    loginResultElement.innerHTML = " Authentication Successful! Redirecting...";
                    loginResultElement.className = "success-message";

                    saveCookie();
                    window.location.href = "color.html"; // keep your redirect
                }
                else 
                {
                    loginResultElement.innerHTML = (jsonObject.message || "Invalid credentials. Please try again.");
                    loginResultElement.className = "error-message";
                }
            }
            else if (this.readyState == 4 && this.status != 200)
            {
                loginResultElement.innerHTML = "Connection error. Please try again later.";
                loginResultElement.className = "error-message";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        loginResultElement.innerHTML = err.message;
        loginResultElement.className = "error-message";
    }
}

function doRegister() {
    var regfirstName = document.getElementById("firstName").value;
    var reglastName = document.getElementById("lastName").value;
    var reglogin = document.getElementById("loginName").value;
    var regpassword = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    var url = urlBase + '/register.' + extension;
    var payload = JSON.stringify({
        firstName: regfirstName,
        lastName: reglastName,
        login: reglogin,
        password: regpassword
    });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error.length > 0) {
                    document.getElementById("loginResult").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("loginResult").innerHTML = "Identity Created Successfully! Redirecting...";
                
                setTimeout(function() {
                    window.location.href = "index.html";
                }, 2000);
            }
        };
        xhr.send(payload);
    } catch (err) {
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

    let contactAddResultElement = document.getElementById("contactAddResult");
    contactAddResultElement.innerHTML = "";
    contactAddResultElement.className = "";

    // Validate fields
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
        contactAddResultElement.innerHTML = "Please fill in all fields";
        contactAddResultElement.className = "error-message";
        return;
    }

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
            if (this.readyState == 4 && (this.status == 200 || this.status == 201))
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    contactAddResultElement.innerHTML = jsonObject.error;
                    contactAddResultElement.className = "error-message";
                } else {
                    contactAddResultElement.innerHTML = "Contact added successfully!";
                    contactAddResultElement.className = "success-message";

                    // Clear all input fields
                    document.getElementById("firstName").value = "";
                    document.getElementById("lastName").value = "";
                    document.getElementById("phone").value = "";
                    document.getElementById("email").value = "";

                    // Clear success message after 3 seconds
                    setTimeout(function() {
                        contactAddResultElement.innerHTML = "";
                        contactAddResultElement.className = "";
                    }, 3000);
                }
            }
            else if (this.readyState == 4 && this.status != 200 && this.status != 201)
            {
                contactAddResultElement.innerHTML = "Error adding contact. Please try again.";
                contactAddResultElement.className = "error-message";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        contactAddResultElement.innerHTML = err.message;
        contactAddResultElement.className = "error-message";
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
                        <div class="contact" id="contact-${contact.id}">
                            <div class="contact-info">
                                <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
                                <a class="contact-phone" href="tel:${contact.phone}">
                                    ${contact.phone}
                                </a>
                                <a class="contact-email" href="mailto:${contact.email}">
                                    ${contact.email}
                                </a>
                            </div>
                            <div class="contact-actions">
                                <button class="edit-btn" onclick="editContact(${contact.id}, '${contact.firstName.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', '${contact.lastName.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', '${contact.phone}', '${contact.email.replace(/'/g, "\\'").replace(/\"/g, '&quot;')}')">
                                    Edit
                                </button>
                                <button class="delete-btn" onclick="deleteContact(${contact.id})">
                                    Delete
                                </button>
                            </div>
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

// DELETE CONTACT
function deleteContact(contactId)
{
    if (!confirm("Are you sure you want to delete this contact?")) {
        return;
    }

    // Validate contactId and userId
    if (!contactId || !userId || userId <= 0) {
        let resultElement = document.getElementById("contactSearchResult");
        resultElement.innerHTML = "✗ Invalid contact or user session. Please refresh and try again.";
        resultElement.className = "error-message";
        return;
    }

    const body = {
        id: parseInt(contactId),
        userId: parseInt(userId)
    };
    const jsonPayload = JSON.stringify(body);

    const url = urlBase + '/deleteContact.' + extension;

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
                
                if (jsonObject.error) {
                    let resultElement = document.getElementById("contactSearchResult");
                    resultElement.innerHTML = "✗ " + jsonObject.error;
                    resultElement.className = "error-message";
                } else {
                    // Remove contact from DOM
                    let contactElement = document.getElementById("contact-" + contactId);
                    if (contactElement) {
                        contactElement.remove();
                    }
                    
                    let resultElement = document.getElementById("contactSearchResult");
                    resultElement.innerHTML = "✓ Contact deleted successfully!";
                    resultElement.className = "success-message";
                    
                    // Clear success message after 3 seconds
                    setTimeout(function() {
                        resultElement.innerHTML = "";
                        resultElement.className = "";
                    }, 3000);
                }
            }
            else if (this.readyState == 4 && this.status == 400)
            {
                // Parse the error response to show specific message
                try {
                    let errorObject = JSON.parse(xhr.responseText);
                    let resultElement = document.getElementById("contactSearchResult");
                    resultElement.innerHTML = "✗ " + (errorObject.error || "Bad request. Please check your input.");
                } catch(e) {
                    let resultElement = document.getElementById("contactSearchResult");
                    resultElement.innerHTML = "✗ Bad request. Please check your input.";
                }
                let resultElement = document.getElementById("contactSearchResult");
                resultElement.className = "error-message";
            }
            else if (this.readyState == 4 && this.status != 200)
            {
                let resultElement = document.getElementById("contactSearchResult");
                resultElement.innerHTML = "✗ Error deleting contact (Status: " + this.status + "). Please try again.";
                resultElement.className = "error-message";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        let resultElement = document.getElementById("contactSearchResult");
        resultElement.innerHTML = "✗ " + err.message;
        resultElement.className = "error-message";
    }
}

// EDIT CONTACT - Opens edit modal
function editContact(contactId, firstName, lastName, phone, email)
{
    // Store contact ID for update
    document.getElementById("editContactId").value = contactId;
    
    // Populate edit form
    document.getElementById("editFirstName").value = firstName;
    document.getElementById("editLastName").value = lastName;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editEmail").value = email;
    
    // Show modal
    document.getElementById("editModal").style.display = "block";
}

// CLOSE EDIT MODAL
function closeEditModal()
{
    document.getElementById("editModal").style.display = "none";
    
    // Clear edit result message
    let editResultElement = document.getElementById("editContactResult");
    editResultElement.innerHTML = "";
    editResultElement.className = "";
}

// UPDATE CONTACT
function updateContact()
{
    const contactId = document.getElementById("editContactId").value;
    const firstName = document.getElementById("editFirstName").value;
    const lastName = document.getElementById("editLastName").value;
    const phone = document.getElementById("editPhone").value;
    const email = document.getElementById("editEmail").value;

    let editResultElement = document.getElementById("editContactResult");
    editResultElement.innerHTML = "";
    editResultElement.className = "";

    // Validate contactId and userId
    if (!contactId || contactId === "0" || !userId || userId <= 0) {
        editResultElement.innerHTML = "✗ Invalid contact or user session. Please refresh and try again.";
        editResultElement.className = "error-message";
        return;
    }

    // Validate fields
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
        editResultElement.innerHTML = "✗ Please fill in all fields";
        editResultElement.className = "error-message";
        return;
    }

    const body = {
        userId: parseInt(userId),
        contactId: parseInt(contactId),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim()
    };
    const jsonPayload = JSON.stringify(body);

    const url = urlBase + '/updateContact.' + extension;

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
                
                if (jsonObject.error || jsonObject.success === false) {
                    editResultElement.innerHTML = "✗ " + (jsonObject.error || jsonObject.message || "Error updating contact");
                    editResultElement.className = "error-message";
                } else {
                    editResultElement.innerHTML = "✓ Contact updated successfully!";
                    editResultElement.className = "success-message";
                    
                    // Close modal after 1.5 seconds and refresh search
                    setTimeout(function() {
                        closeEditModal();
                        searchContact(); // Refresh the contact list
                    }, 1500);
                }
            }
            else if (this.readyState == 4 && this.status == 400)
            {
                // Parse the error response to show specific message
                try {
                    let errorObject = JSON.parse(xhr.responseText);
                    editResultElement.innerHTML = "✗ " + (errorObject.message || "Bad request. Please check your input.");
                } catch(e) {
                    editResultElement.innerHTML = "✗ Bad request. Please check your input.";
                }
                editResultElement.className = "error-message";
            }
            else if (this.readyState == 4 && this.status != 200)
            {
                editResultElement.innerHTML = "✗ Error updating contact (Status: " + this.status + "). Please try again.";
                editResultElement.className = "error-message";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        editResultElement.innerHTML = "✗ " + err.message;
        editResultElement.className = "error-message";
    }
}