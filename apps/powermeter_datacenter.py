#!/usr/bin/python
#
# get the latest power consumption values from redis in JSON format
# pass parameter ?n=<number> to control the number of items returned
#
# {"Total": [3734, ...], "Seconds ago": [0, ...] }
#

import redis
import json
import cgi

getp = cgi.FieldStorage();

baseKey = "sensordata.shackspace.zaehler_rz_001.data."
sensors = ["Power"]
numValues = 500


if "n" in getp:
	numValues = int(getp["n"].value)

rc = redis.Redis("glados.shack")

# get the numValues latest values
res = rc.lrange(baseKey+sensor, -numValues, -1)

output = {}

# convert time on the fly
latest = json.loads(res[-1])[0]
output["Seconds ago"] = map(lambda kv: json.loads(kv)[0]-latest , res)
output["Total"] = map(lambda kv: json.loads(kv)[1] , res)

# off we go
print "Content-Type: application/json"
print
print json.dumps(output)
