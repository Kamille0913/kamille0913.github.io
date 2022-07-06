//Create selectors
const $result_placeholder = document.querySelector('#compute_result')
const $resultTemplate = document.querySelector('#resultTemplate').innerHTML
const $no_resultTemplate = document.querySelector('#no_resultTemplate').innerHTML

//Loader for results
let loader = `
<div class="d-flex justify-content-center my-3">
    <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
    </div>
</div>`

//Declare function that makes the request to api and writes data
const computeWater = async (roof, persons, consumption) => {

    //Add loader
    $result_placeholder.innerHTML = loader
  
    try {
        const response = await fetch(`https://lets-talk-water-api.herokuapp.com/api/?roofarea=${roof}&persons=${persons}&consumption=${consumption}`)
        const data = await response.json()
        $result_placeholder.innerHTML = ''

        const html = Mustache.render($resultTemplate, {
            sump_capacity: data.sump_capacity,
            no_days: data.roof_supply,
            no_days_ext: data.ext_supply,
        })

        $result_placeholder.innerHTML = html
    }
    catch(e){
        $result_placeholder.innerHTML = ''
        const html = Mustache.render($no_resultTemplate, {})
        $result_placeholder.innerHTML = html
    } 
}

//Take user options of the url
const qs_inputs = Qs.parse(location.search, { ignoreQueryPrefix: true })

//Store that in the local storage for reuse when returning to app
localStorage.setItem("inputs", JSON.stringify(qs_inputs))

// Launch water function with input values
var object = computeWater(qs_inputs.roof, qs_inputs.persons, qs_inputs.consumption)
