
var r = null;
var c = null;
var r_datacenter = null;
var c_datacenter = null;
var DELAY = 2000;

var powergraphViewModel = {
	selDurationOptions: 		[15, 				30, 			150, 			300, 			9000, 		1800, 	5400, 	10800],
	selDurationOptionsText: ["0.5 min",	"1 min", 	"5 min",	"10 min", "0.5 h",	"1 h",	"3 h", 	"6 h"],
	selDurationSelectedValue: ko.observable(900),

//	pgTotal_Total: ko.observable(0),
//	pgTotal_L1: ko.observable(0),
//	pgTotal_L2: ko.observable(0),
//	pgTotal_L3: ko.observable(0),
//	pgDatacenter_Total: ko.observable(0),
}



function fetch_powermeter() {
	$.getJSON("/siid/apps/powermeter.py",
		{ n: powergraphViewModel.selDurationSelectedValue },
		fetched_powermeter )
}

function fetched_powermeter(data) {
	if(c)
	{
		c.remove()
	}

	//powergraphViewModel.pgTotal_Total(data["Total"][-1]);
	//powergraphViewModel.pgTotal_L1(data["L1.Power"][-1]);
	//powergraphViewModel.pgTotal_L2(data["L2.Power"][-1]);
	//powergraphViewModel.pgTotal_L3(data["L3.Power"][-1]);

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
	$.getJSON("/siid/apps/powermeter_datacenter.py",
		{ n: Math.ceil( parseInt(powergraphViewModel.selDurationSelectedValue) / 2 ) },
		fetched_powermeter_datacenter )
}

function fetched_powermeter_datacenter(data) {
	if(c_datacenter)
	{
		c_datacenter.remove()
	}

	//powergraphViewModel.pgDatacenter_Total(data["Total"][-1]);

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
