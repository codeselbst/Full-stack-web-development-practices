function checkAll_lan(source) {
    checkboxes = document.getElementsByName('language');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
  }
  function checkAll_dig(source) {
    checkboxes = document.getElementsByName('programming');
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
  }

  var firstname = document.getElementById('first');
  var lastname = document.getElementById('last');
  var firstnameOnDisplay = document.getElementById('firstName');
  var lastnameOnDisplay = document.getElementById('lastName');
  var sex = document.getElementById('nextHugeStepForHumanbeings').sex;
  var sexOnDisplay = document.getElementById('sex');

  var form = document.getElementById('nextHugeStepForHumanbeings');
//extract selected option(s)
  var nationality = document.getElementsByName('nationality');
  var nationalityOnDisplay = document.getElementById('nationality');
function countrySubmit(element){
        country = element.selectedIndex;
        countryname = element.options[country].value;
}
//same for academic background
 var degreeOnDisplay = document.getElementById('education');
function educationSubmit(element){
    education= element.selectedIndex;
    education = element.options[education].value;
}

  form.addEventListener('submit',function(event){
  //set boolean to check whether the sex checkbox is selected or not
    var sexIsSelected = false;
    for ( var i = 0; i < sex.length; i++) {
      if(sex[i].checked) {
          sexIsSelected = true;
          break;
      }
  }
  //extract value from checkboxes for language section
 var languages = document.getElementsByName('language');
 var languageOnDisplay = document.getElementById('language');
 const languageSelectedList = [];
 for (let i = 0; i < languages.length; i++){
    if(languages[i].checked){ 
        languageSelectedList.push(languages[i].value);
    }
}
//extract value from motivation section (textarea)
 var motivation =document.getElementById('comment').value;
 var motivationOnDisplay = document.getElementById('motivation');
    if( !firstname.value || !lastname.value || !sexIsSelected) {
        alert("Make sure you have filled in all the information!!");
    } else {
       
        firstnameOnDisplay.innerText = firstname.value;
        lastnameOnDisplay.innerText = lastname.value;
        sexOnDisplay.innerText = sex.value;
        nationalityOnDisplay.innerText = countryname;
        degreeOnDisplay.innerText = education;
        languageOnDisplay.textContent = languageSelectedList;
        motivationOnDisplay.textContent = motivation;

       event.preventDefault();
    }
});

function confirm(){
    alert('Registration Completed');
    window.location.reload();
}