
var r = null;
var c = null;
var DELAY = 2000;

function fetch() {
	$.get("/siid/apps/powermeter.py", { n: $("#powergraph_duration").val() }, fetched)
}

function fetched(data) {
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

	window.setTimeout(fetch,DELAY);
}


function siid_start() {
	r = new Raphael("powergraph_total");
	fetch();
}
