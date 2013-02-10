/// \brief limit the number of elements in an array by rotating out the oldest ones
if(Array.prototype.rotateLimit == null)
{
	Array.prototype.rotateLimit = function(size)
	{
		while(this.length > size) { this.shift() }
	}
}

/// \brief access to the last element in an array
if(Array.prototype.last == null)
{
	Array.prototype.last = function()
	{
		if(this.length > 0)
		{
			return this.slice(-1)[0]
		}
		else
		{
			return null
		}
	}
}

function calculateTimeAgo(arr, now)
{
		return arr.map( function(e) { return e-now } )
}

var r = null;
var c = null;
var MAX_DATA_ITEMS = 500;
var DELAY = 500;
var datay = [];
var datax = [];



var label 	= ["ID"		,"Total [kWh]"	,"??"		,"??"		,"U1 [V]"	,"U2 [V]"	,"U3 [V]"	,"I1 [A]"	,"I2 [A]"	,"I3 [A]"	,"P1 [W]"	,"P2 [W]"	,"P3 [W]"];
var doPlot 	= [false	,false				  ,false	,false  ,false		,false		,false		,false		,false		,false		,true			,true			,true];

function fetch() {
	console.log("fetch");
	$.get("//localhost:8000/cgi-bin/get.sh","",fetched,"html");
}


function fetched(data, textStatus, jqXHR) {
	console.log("fetched");

	var row = data.split("\n").slice(0,-9);
	console.log(row)
	if(row.length != label.length)
	{
		console.log("data length mismatch! row.length="+row.length+"  label.length="+label.length)
	}
	else
	{
		datax.push(new Date().getTime())
		datax.rotateLimit(MAX_DATA_ITEMS)

		$.map(row,function(e,i)
		{
			if(!datay[i])
			{
				datay[i] = [];
			}

			datay[i].push( e.match(/\(([^\)\*]+)/)[1] )
			datay[i].rotateLimit(MAX_DATA_ITEMS)
		})
			

		if(c)
		{
			c.remove()
		}

		var plotlabel = [];
		var ploty = [];

		for(var i=0; i<datay.length; i++)
		{
			if(doPlot[i])
			{
				console.log("plotting "+label[i])
				ploty.push( datay[i] )
				plotlabel.push( label[i] )
			}
		}

		plotx = calculateTimeAgo(datax,datax.last()).map( function(e) { return e/3600 } );

		c = r.linechart(50,0,1000,300,plotx,ploty,{axis: "0 1 1 0"});
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
	}
	window.setTimeout(fetch,DELAY);
}

window.onload = function() {
	r = new Raphael("holder");
	fetch();
}
