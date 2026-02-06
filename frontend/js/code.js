const urlBase = 'https://cop4331lamp.zachspri.ng/backend';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
    userId = 0;
    firstName = "";
    lastName = "";
    
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login:login,password:password};
    let jsonPayload = JSON.stringify( tmp );
    
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
				
				// PHP returns { "success": true, "data": { "userId": 1, "firstName": "...", "lastName": "..." } }
				// So we must access the "data" property first:
				if (jsonObject.success && jsonObject.data) 
				{
					userId = jsonObject.data.userId;
					firstName = jsonObject.data.firstName;
					lastName = jsonObject.data.lastName;

					saveCookie();
					window.location.href = "color.html";
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

function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    // Path=/ is critical to ensure color.html can read the cookie set by index.html
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";
}

function readCookie()
{
    userId = -1;
    let data = document.cookie;
    
    // Splitting by semicolon first to handle standard browser cookie formatting
    let entries = data.split(";");
    for(var i = 0; i < entries.length; i++) 
    {
        let entry = entries[i].trim();
        let strips = entry.split(",");
        
        for(var j = 0; j < strips.length; j++)
        {
            let thisOne = strips[j].trim();
            let tokens = thisOne.split("=");
            if( tokens[0] == "userId" )
            {
                userId = parseInt( tokens[1].trim() );
            }
            else if( tokens[0] == "firstName" )
            {
                firstName = tokens[1];
            }
            else if( tokens[0] == "lastName" )
            {
                lastName = tokens[1];
            }
        }
    }
    
    if( userId < 1 )
    {
        window.location.href = "index.html";
    }
    else
    {
        // Check if the element exists before trying to write to it
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
    // Clear cookie by expiring it and matching the global path
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = "index.html";
}

function addColor()
{
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    let tmp = {color:newColor, userId:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/AddColor.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                document.getElementById("colorAddResult").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }
}

function searchColor()
{
    let srch = document.getElementById("searchText").value;
    document.getElementById("colorSearchResult").innerHTML = "";
    
    let colorList = "";

    let tmp = {search:srch, userId:userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/SearchColors.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
                let jsonObject = JSON.parse( xhr.responseText );
                
                // Ensure we have a results array and a place to put it
                let displayPara = document.getElementsByTagName("p")[0];
                if (displayPara && jsonObject.results)
                {
                    for( let i=0; i<jsonObject.results.length; i++ )
                    {
                        colorList += jsonObject.results[i];
                        if( i < jsonObject.results.length - 1 )
                        {
                            colorList += "<br />\r\n";
                        }
                    }
                    displayPara.innerHTML = colorList;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }
}