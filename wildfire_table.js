var button = d3.select("#filter-btn");

var reset = d3.select("#reset-btn");
        
var tbody = d3.select("tbody");
    
    
function createTable(wildfireData) {
    wildfireData.forEach(data => {
        var row = tbody.append("tr");
        
        Object.values(data).forEach(value =>{
                
            var cell = row.append("td");
            
            cell.text(value);
            });
        });
        
function TableBottun() {
    
    var url = "/firetable"
    
    d3.json(url, function(response) {
        
        console.log(response)
        
        let data = response
        
        d3.event.preventDefault();
        
        var InputYear = d3.select("#year").property("value"); 
                
        var InputState = d3.select("#state").property("value");
                    
        var filteredData = data;

	if (InputYear != ""){
    	filteredData = filteredData.filter(filterdata => filterdata.FIRE_YEAR === InputYear);
    }
    
    if (InputState !=""){
        filteredData = filteredData.filter(filterdata => filterdata.STATE.toUpperCase() === inputState.toUpperCase());
        }

    tbody.html('');
    renderTable(filteredData);
}

function resetTableBottun() {
	tbody.html('');
	renderTable(data);
};

renderTable(data);
filter.on("click", filterTableBottun );
reset.on("click", resetTableBottun);
