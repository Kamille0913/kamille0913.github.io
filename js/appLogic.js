// Select different HTML elements with which we will interact
var $area_input = document.querySelector('#roofArea')
var $persons_input = document.querySelector('#nbResidents')
var $consumption_input = document.querySelector('#waterDemand')


//Show the modal upon loading the page
if (localStorage.getItem('IsModalShown') != 'true') 

{
  $(window).on('load',function(){
    $('#exampleModal').modal('show');
  });

  localStorage.setItem('IsModalShown', true);
}

//Enable popovers
$(function () {
    $('[data-toggle="popover"]').popover()
  })

  $('.popover-dismiss').popover({
    trigger: 'focus'
})

//If the user comes back from the output page fill in the inputs with values stored in localstorage  
var inputs = JSON.parse(localStorage.getItem('inputs'))

if(inputs) {
  $area_input.value = inputs.roof
  $persons_input.value = inputs.persons
  $consumption_input.value = inputs.consumption
  console.log(window.location.hash.substring(1))
}
