$("#btnAddSubject").on("click", function(){
  $("#btnModalSave").show();
  $("#btnModalUpdate").hide();
  $("#modalTitle").html("Add Subject");
  $("#hidden_menu").val("add");
  clear_content();

  $("#cboSubject").html(Stringify_Select(Get_Subjects("fetch_subjects")));
  $("#cboPrerequisit1").html(Stringify_Subjects(Get_Subjects("fetch_prerequisits")));
  $("#cboPrerequisit2").html(Stringify_Subjects(Get_Subjects("fetch_prerequisits")));
}); //end btnAdd


$("#formAdd").on("submit",function(event){
  event.preventDefault();
  var menu = $("#hidden_menu").val();
  var id = $("#hidden_id").val();
  var subj_id = $("#cboSubject").val();
  var year = $("#cboYear").val();
  var sem = $("#cboSem").val();
  var req1 = $("#cboPrerequisit1").val();
  var req2 = $("#cboPrerequisit2").val();

  Processing_Modal("Processing!");
  $.ajax({
      url: "../api/curriculum.php", method:"POST",
      data: {action:menu, course_id:course_id,subj_id:subj_id,year:year,sem:sem,req1:req1,req2:req2},
      success: function(data){

         if(data=="failed"){
              Error_Message_SweetAlert("Unable to add subject");
          }
          else{
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: (menu=="add") ? 'Record Saved!':'Record Update',
                  showConfirmButton: false,
                  timer: 1500
                })
                $("#btnModalClose").click();
                $("#curriculum").html("");
                load_curriculum(course_id);
          
              Processing_Close(1000);
          }
      },error: function(xhr, status, error){
          var errorMessage = xhr.status + ': ' + xhr.statusText
          Error_Message_SweetAlert(errorMessage);
      }
  });

}); // end formAdd

$(document).on("click",".btnDelete", function(){
  var id = $(this).data("id");
  var subj_desc = $(this).data("subj_code") + ' | ' + $(this).data("subj_desc");

  Swal.fire({
      title: 'Are you sure?',
      text: "Remove "  + subj_desc,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
      }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire({ title: 'Loading!', html: 'Please wait..',allowOutsideClick: false,onBeforeOpen: () => { Swal.showLoading() }, });
          //remove ajax
          $.ajax({
              url: "../api/curriculum.php", method: "POST", data: {id:id, action:"remove"},success:function(data){
             
                if(data=="success") {
                  Swal.fire(
                    'Deleted!',
                    subj_desc + ' removed.',
                    'success'
                    )

                    $("#curriculum").html("");
                    load_curriculum(course_id);
   
                } 
              
              },error: function(xhr, status, error){
                  var errorMessage = xhr.status + ': ' + xhr.statusText 
              Swal.fire({icon: 'error',title: 'Error....',text: 'No network connection!'}) 
              }
          });

         
      }
      })
}); // end .btnRemove

function load_curriculum(c_id){
    //  let position = Get_Parse_Session(Get_Session_Data()).position;
      $.ajax({
      
          url: "../api/curriculum.php", method: "GET", dataType: "JSON",data: {action:"fetch_curriculum",course_id:c_id},
          success: function(data){
              var s =0;
              var cur=0;
              var total=0;
              var string = JSON.stringify(data);
              var parse = JSON.parse(string);
           
                      var rowCount = parse.length;
                    var newRow ="";
                      for(var i=0; i < rowCount;i++){    
                          var id = parse[i]['id'];
                          var subj_code = parse[i]['subj_code'];
                          var subj_desc = parse[i]['subj_desc'];
                          var units = parse[i]['units'];
                          var req1 = parse[i]['req1'];
                          var req2 = parse[i]['req2'];
                          var req3 = parse[i]['req3'];
                          var year = parse[i]['year'];
                          var sem = parse[i]['sem'];
                          var prerequisites = req1 + " " + req2 + " " + req3;
                       
                          total += parseInt(units);
                          //create table curriculum
                          if(s!=parseInt(sem)){
                            cur++;
                            s=sem;
                            $("#curriculum").append(Create_Table_Curriculum(cur));
                            $("#year_sem_"+cur).html("<strong>"+Year_Sem_Title(year,sem)+"</strong>");

                            Create_Row_Total(cur-1,total-units); total = parseInt(units);
                          }
                        
                          button = "<span id='btnRemove_"+id+"'></span>";
                          newRow = "<tr><td>"+subj_code+"</td>" +
                                    "<td>"+subj_desc+"</td>" +
                                    "<td>"+units+"</td>" +
                                    "<td>"+prerequisites+"</td>" +
                                    "<td>"+button+"</td></tr>"
                             
                            $("#curriculumTable_"+cur).append(newRow);
                              //action buttons
                              Create_Remove_Button(id,subj_code,subj_desc);
                            
                            //create total
                            if(rowCount-i==1){Create_Row_Total(cur,total) }
                         
                      }
                     
          }
      });
  }

  Create_Row_Total = (row_id,total)=>{
    totalRow = "<tr><td></td>" +
    "<td align='center'><strong>Total</strong></td>" +
    "<td><strong>"+total+"</strong></td>" +
    "<td></td>" +
    "<td></td></tr>"
    $("#curriculumTable_"+row_id).append(totalRow);
  }

  //Action Buttons
  Create_Remove_Button = (id,subj_code,subj_desc) =>{
    const removeButton = new Button({text: "",clickHandler: () => {},attributes: {id: "btnRemove" + id,class: "btn btn-danger btn-sm btnDelete",title:"Remove Subject" },htmlContent: "<span class='fa fa-trash'></span>",dataAttributes: {id: id,subj_code:subj_code,subj_desc:subj_desc,toggle:"modal",target:"#addModal"}});

    const removeButtonElement = removeButton.render();
    $("#btnRemove_" + id).html( removeButtonElement);
  }

  Year_Sem_Title = (y,s) =>{
    var year = "First Year";
    var sem = "First Semester"
    if(y==1){year="First Year";}else if(y==2){year="Second Year";}else if(y==3){year="Third Year";}else{year="Fourth Year";}
    if(s==1){sem="First Semester";}else{sem="Second Semester";}
    return year + " - " + sem;
  }

  Create_Table_Curriculum = (id) =>{
    var html ="<div class='row'>" +
    "<div class='col-md-12 col-lg-12'>" +
        "<div class='card'>" +
            "<div class='card-header' id='year_sem_"+id+"'><strong>First Year - Second Semester</strong></div>" +
            "<div class='card-body'>" +
                "<div class='table-responsive'>" +
                    "<table class='table table-sm'>" +
                        "<thead>" +
                            "<tr>" +
                                "<th scope='col'>Course Code</th>" + 
                                "<th scope='col'>Course Description</th>" +
                                "<th scope='col'>Units</th>" +
                                "<th scope='col'>Pre-requisites</th>" +
                                "<th scope='col'>Actions</th>" +
                                "</tr>" +
                                "</thead>" +
                                "<tbody id='curriculumTable_" +id+"'>" +
                        
                                "</tbody>" +
                                "</table>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
      return html;
  }

  Stringify_Subjects = (data) =>{
    var p= JSON.parse(data);
  
    var rowCount = p.length;
    var str =" <option value='0'>None</option>";

    for(var i=0; i<rowCount;i++){
          str += "<option value='" + p[i]["id"] + "'>" + p[i]["retrievedata"] + "</option>";          
    }
    return str;
}

Get_Subjects = (action) =>{
  return $.ajax({ url: "../api/curriculum.php", method: "GET",data:{action:action,course_id:course_id},
   success: function (){
   },async:false
   }).responseText

}

function clear_content(){
  $("#cboYear").val("");
  $("#cboSem").val("");
  $("#cboSubject").val("0");
  $("#cboPrerequisit1").val("0");
  $("#cboPrerequisit2").val("0");
}