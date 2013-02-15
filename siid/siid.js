
var r = null;
var c = null;
var DELAY = 2000;

function fetch() { $.get("/siid/apps/powermeter.py", "",fetched) }

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
									{axis: "0 1 1 0"}
									);

/*
    c.labels = r.set();
		var x = 15; var h = 5;
		for( var i = 0; i < plotlabel.length; ++i )
		{
			var clr = c.lines[i].attr("stroke");
			c.labels.push(r.set());
			//c.labels[i].push(r.g["disc"](x + 5, h, 5)
			//										 .attr({fill: clr, stroke: "none"}));
			c.labels[i].push(txt = r.text(x + 20, h, plotlabel[i])
													 .attr(r.g.txtattr)
													 .attr({fill: "#000", "text-anchor": "start"}));
			x += c.labels[i].getBBox().width * 1.2;
		}
		*/
	window.setTimeout(fetch,DELAY);
}

window.onload = function() {
	r = new Raphael("powergraph");
	fetch();
}
