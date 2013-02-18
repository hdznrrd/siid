
var r = null;
var c = null;
var r_datacenter = null;
var c_datacenter = null;
var DELAY = 2000;

function fetch_powermeter() {
	$.get("/siid/apps/powermeter.py", { n: $("#powergraph_duration").val() }, fetched_powermeter)
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
									data["Seconds ago"],
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
	$.get("/siid/apps/powermeter_datacenter.py", { n: Math.ceil( $("#powergraph_duration").val() / 2) }, fetched_powermeter_datacenter)
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
									data["Seconds ago"],
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
	r = new Raphael("powergraph_total");
	r_datacenter = new Raphael("powergraph_datacenter_only");
	fetch_powermeter();
	fetch_powermeter_datacenter();
}
