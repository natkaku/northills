// Processing_Modal("Processing!");
Processing_Modal = (action) =>{
    Swal.fire({ title: action, html: 'Please wait..',allowOutsideClick: false,onBeforeOpen: () => { Swal.showLoading() }, });
}
// Processing_Close(1000);
Processing_Close = (timeout) =>{
    setTimeout(function(){ swal.close(); }, timeout);
}
// Error_Message_SweetAlert(errorMessage);
Error_Message_SweetAlert = (errorMessage) =>{
    Swal.fire({
        icon: 'error',
        title: 'Oops',
        text: 'Something went wrong! ' + errorMessage
      }) 
}


//load window of current user
function load_window(){
  
    $.ajax({
      url: "../api/session.php",
      method: "POST",
      dataType: "JSON",
      error: function(){
          window.location.replace("../index.html");
      },
      success: function(data){
         var fname = data.firstName;
         var lname = data.lastName;
          
        $("#uname").html(fname + " " + lname);

        if(data.position!="Administrator"){
            $("#menuUsers").html("");
        }else{
            $("#menuUsers").html("<li><a href='#user'><i class='fas fa-user-friends'></i>Users</a></li>");
        }
       
          }
    });
  }

//get session data
  Get_Session_Data = () =>{
    
    return $.ajax({  url: "../api/session.php",
    method: "GET",
    dataType:"JSON",
    async:false
     }).responseText;
  
 }

 Get_Parse_Session = (data) =>{
    var parse = JSON.parse(data);
    return parse;
}

//get single data
Get_Generic = () =>{
    return $.ajax({ url: "../api/medicines.php", method: "GET",data:{action:"generic"},
     success: function (data){
     }, async: false
     }).responseText;
  
 }

// for options Datalist and Select Element
 Stringify_Data = (data) =>{
    var parse = JSON.parse(data);
    var rowCount = parse.length;
    var str ="";
   
    for(var i=0; i<rowCount;i++){
          str += "<option value='" + parse[i]["retrievedata"] + "'>" + parse[i]["retrievedata"] + "</option>";          
    }
    return str;
}

Stringify_DataList = (data) =>{
    var parse = JSON.parse(data);
    var rowCount = parse.length;
    var str ="";
   
    for(var i=0; i<rowCount;i++){
          str += "<option value='" + parse[i]["retrievedata"] + "'>" + parse[i]["retrievedata"] + "</option>";          
    }
    return str;
}

Stringify_Select = (data) =>{
    var parse = JSON.parse(data);
    var rowCount = parse.length;
    var str =" <option value selected disabled>Select</option>";
   
    for(var i=0; i<rowCount;i++){
          str += "<option value='" + parse[i]["id"] + "'>" + parse[i]["retrievedata"] + "</option>";          
    }
    return str;
}

// class create button element
class Button {
    constructor(options) {
        this.text = options.text || "Button";
        this.clickHandler = options.clickHandler || function() {};
        this.attributes = options.attributes || {};
        this.htmlContent = options.htmlContent || '';
        this.dataAttributes = options.dataAttributes || {}; 
    }
    render() {
        const button = document.createElement("button");
        button.textContent = this.text;
        button.innerHTML = this.htmlContent; // Set HTML content
        button.addEventListener("click", this.clickHandler);
     
        // Set attributes
        for (const [key, value] of Object.entries(this.attributes)) {
            button.setAttribute(key, value);
        }

        // Set data attributes
        for (const [key, value] of Object.entries(this.dataAttributes)) {
            button.setAttribute(`data-${key}`, value);
        }   
        return button;
    }
}

formattedNumber = (number) => {
var formatNumber = parseFloat(number).toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
    return formatNumber;
}