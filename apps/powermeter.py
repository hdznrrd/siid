#!/usr/bin/python
#
# get the latest power consumption values from redis in JSON format
# pass parameter ?n=<number> to control the number of items returned
#
# {"Total": [3734, ...], "Minutes ago": [0, ...], "L1.Power": [1612, ...], "L3.Power": [1363, ...], "L2.Power": [759, ...]}
#

import redis
import json
import cgi

getp = cgi.FieldStorage();

baseKey = "sensordata.shackspace.20745965.data."
sensors = ["L1.Power","L2.Power","L3.Power"]
numValues = 500


if "n" in getp:
	numValues = int(getp["n"].value)

rc = redis.Redis("glados.shack")

# ensure all queries are atomic so the time values are sync
pipe = rc.pipeline(transaction=True)

for sensor in sensors:
	# get the numValues latest values
	pipe.lrange(baseKey+sensor, -numValues, -1)

res = pipe.execute()

output = {}

# convert time on the fly
latest = json.loads(res[0][-1])[0]
output["Minutes ago"] = map(lambda kv: (json.loads(kv)[0]-latest)/60000.0 , res[0])

for idx, sensordata in enumerate(res):
	output[sensors[idx]] = map(lambda kv: json.loads(kv)[1] , sensordata)

from operator import add
output["Total"] = map(	add, map(	add, output[sensors[0]], output[sensors[1]]), output[sensors[2]] )

# off we go
print "Content-Type: application/json"
print
print json.dumps(output)
