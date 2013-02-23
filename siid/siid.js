
var r = null;
var c = null;
var r_datacenter = null;
var c_datacenter = null;
var DELAY = 2000;

var powergraphViewModel = {
selectPowergraphDurationOptions = 		[15, 				30, 			150, 			300, 			9000, 		1800, 	5400, 	10800],
selectPowergraphDurationOptionsText = ["0.5 min",	"1 min", 	"5 min",	"10 min", "0.5 h",	"1 h",	"3 h", 	"6 h"],
selectPowergraphDurationSelectedValue = ko.observable(900),
}



function fetch_powermeter() {
	$.getJSON("/siid/apps/powermeter.py", { n: powergraphViewModel.selectPowergraphDurationSelectedValue }, fetched_powermeter)
}

function fetched_powermeter(data) {
	if(c)
	{
		c.remove()
	}

	c = r.linechart(0,
									0,
									$("#powergraph_total").width()-30,
									$("#powergraph_total").height()-30,
									data["Minutes ago"],
									[
										data["L1.Power"],
										data["L2.Power"],
										data["L3.Power"],
										data["Total"],
										[0]
									],
									{
										axis: "0 1 1 0",
										colors: ["#aa0000","#00aa00","#0000aa","#aa00aa"]
									}
									);

	window.setTimeout(fetch_powermeter,DELAY);
}

function fetch_powermeter_datacenter() {
	$.getJSON("/siid/apps/powermeter_datacenter.py", { n: Math.ceil( powergraphViewModel.selectPowergraphDurationSelectedValue / 2.0) }, fetched_powermeter_datacenter)
}

function fetched_powermeter_datacenter(data) {
	if(c_datacenter)
	{
		c_datacenter.remove()
	}

	c_datacenter = r_datacenter.linechart(0,
									0,
									$("#powergraph_datacenter_only").width()-30,
									$("#powergraph_datacenter_only").height()-30,
									data["Minutes ago"],
									[
										data["Total"],
										[0]
									],
									{
										axis: "0 1 1 0",
										colors: ["#aa00aa"]
									}
									);

	window.setTimeout(fetch_powermeter_datacenter,DELAY);
}


function siid_start() {
	ko.applyBindings(powergraphViewModel);

	r = new Raphael("powergraph_total");
	r_datacenter = new Raphael("powergraph_datacenter_only");
	fetch_powermeter();
	fetch_powermeter_datacenter();
}
