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


/// \brief helper class to fetch data from the shackspace power meter
/// \param timeout_ms timeout for async fetches, use 0 for infinite timeout
/// \param cb_success function(data) called on successful finishing of a fetch
/// \param cb_failure function() called on failure
function PowermeterAsyncFetch(timeout_ms, cb_success, cb_failure)
{
	this._fake = true;

	this._timeout_ms = timeout_ms;

	this._cb_success = function(data) { if(cb_success) { cb_success(data); } };
	this._cb_failure = function() { if(cb_failure) { cb_failure(); } };

	this._fakeSrc = new FakeOBIS();

	this.startFetch = function()
	{
		var self = this;

		if(self._fake)
		{
			self._cb_success( self._fakeSrc.getData() );
		}
		else
		{
			$.get( "//localhost:8000/cgi-bin/get.sh", "", self._cb_success, "html", self._timeout_ms > 0 ? self._timeout_ms : undefined )
				.error(	self._cb_failure );	
		}
	}
}



function FakeOBIS()
{
	this._lastTime = new Date().getTime();
	this._totalW = 36905.8247;
	this._voltageBase = [230, 230, 230];
	this._voltageSpread = [10, 10, 10];
	this._currentBase = [11.21, 3.38, 5.42];
	this._currentSpread = [0.3, 0.2, 0.11];

	this.getNextRating = function( base, spread )
	{
		return $.map( base, function(e,i) { return parseFloat(e) + (Math.random()*parseFloat(spread[i])-parseFloat(spread[i])/2.0); });
	}

	this.getPowerRating = function( voltageRating, currentRating )
	{
		return $.map( voltageRating, function(e,i) { return parseFloat(e) * parseFloat(currentRating[i]); } );
	}

	this.getConsumptionIncrement = function( powerRating, deltaTime_h )
	{
		var sum = 0;
		$.each( powerRating, function() { sum += parseFloat(this) || 0; } );
		return sum * deltaTime_h;
	}

	this.getData = function()
	{
		var thisTime = new Date().getTime();
		var deltaTime_h = (thisTime - this._lastTime) / 3600000;
		this._lastTime = thisTime;

		var vr = this.getNextRating( this._voltageBase, this._voltageSpread );
		var cr = this.getNextRating( this._currentBase, this._currentSpread );
		var pr = this.getPowerRating( vr, cr );
		this._totalW += this.getConsumptionIncrement( pr, deltaTime_h );

		var obis = "1-0:0.0.0*255(20745965)\n"
		+ "1-0:1.8.0*255(" + this._totalW + ")\n"
		+ "1-0:96.5.5*255(82)\n"
		+ "0-0:96.1.255*255(0000120120)\n"
		+ "1-0:32.7.0*255(" + vr[0].toFixed(2) + "*V)\n"
		+ "1-0:52.7.0*255(" + vr[1].toFixed(2) + "*V)\n"
		+ "1-0:72.7.0*255(" + vr[2].toFixed(2) + "*V)\n"
		+ "1-0:31.7.0*255(" + cr[0].toFixed(2) + "*A)\n"
		+ "1-0:51.7.0*255(" + cr[1].toFixed(2) + "*A)\n"
		+ "1-0:71.7.0*255(" + cr[2].toFixed(2) + "*A)\n"
		+ "1-0:21.7.0*255(+" + pr[0].toFixed(2) + "*W)\n"
		+ "1-0:41.7.0*255(+" + pr[1].toFixed(2) + "*W)\n"
		+ "1-0:61.7.0*255(+" + pr[2].toFixed(2) + "*W)\n"
		+ "1-0:96.50.0*0(EF)\n"
		+ "1-0:96.50.0*1(07D2)\n"
		+ "1-0:96.50.0*2(0D)\n"
		+ "1-0:96.50.0*3(01)\n"
		+ "1-0:96.50.0*4(2C)\n"
		+ "1-0:96.50.0*5(0A)\n"
		+ "1-0:96.50.0*6(003D381B260A16F1F6FE560200009F80)\n"
		+ "1-0:96.50.0*7(00)\n";

		console.log("obis: " + obis);
		return obis;
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
var pm = null;


var label 	= ["ID"		,"Total [kWh]"	,"??"		,"??"		,"U1 [V]"	,"U2 [V]"	,"U3 [V]"	,"I1 [A]"	,"I2 [A]"	,"I3 [A]"	,"P1 [W]"	,"P2 [W]"	,"P3 [W]"];
var doPlot 	= [false	,false				  ,false	,false  ,false		,false		,false		,false		,false		,false		,true			,true			,true];

function fetch() {
	console.log("fetch");
	pm.startFetch();
}


function fetched(data) {
	console.log("fetched: " + data);

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
	pm = new PowermeterAsyncFetch(0,fetched,null);
	fetch();
}
