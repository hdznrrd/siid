
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
									$("#powergraph").width()-30,
									$("#powergraph").height()-30,
									data["Seconds ago"],
									[
										data["L1.Power"],
										data["L2.Power"],
										data["L3.Power"],
										[0]
									],
									{
										axis: "0 1 1 0",
										colors: ["#aa0000","#00aa00","#0000aa"]
									}
									);

	window.setTimeout(fetch,DELAY);
}

window.onload = function() {
	r = new Raphael("powergraph");
	fetch();
}
