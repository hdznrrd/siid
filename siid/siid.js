
var r = null;
var c = null;
var DELAY = 500;

function fetch() {
	console.log("fetch");
	$.get("/siid/apps/powermeter.py","",fetched)
}


function fetched(data) {
	console.log("fetched: " + data);
	
	c = r.linechart(50,0,1000,300,data["Time"],[data["L1.Power"],data["L2.Power"],data["L3.Power"]],{axis: "0 1 1 0"});
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
	r = new Raphael("holder");
	fetch();
}
