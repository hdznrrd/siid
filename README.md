# shackspace interactive info display
## SYNOPSIS
This is going to be a web-based information center for shackspace, the Stuttgart hackerspace.

The aim of this project is to display current statistics (power used, heater settings, network traffic, ...).
A future version may include touch functionality to navigate between various display modes and possibly include control functionality as well.

## How does it work?
You have to be connected to the shackspace intranet otherwise you will not have access to the powerraw.shack service

### Same-origin workaround
You can start server.sh which will start a small python webserver.
The javascript code will then poll localhost:8000/cgi-bin/get.sh which will fetch data from powerraw.shack.
