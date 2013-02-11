#!/usr/bin/python

import web
import redis
import json

baseKey = "sensordata.shackspace.20745965.data."
sensors = ["L1.Power","L2.Power","L3.Power"]
numValues = 300

rc = redis.Redis("glados.shack")

# ensure all queries are atomic so the time values are sync
pipe = rc.pipeline(transaction=True)

for sensor in sensors:
	# get the numValues latest values
	pipe.lrange(baseKey+sensor, -numValues, -1)

res = pipe.execute()

output = {}

output["Time"] = map(lambda kv: json.loads(kv)[0] , res[0])

for idx, sensordata in enumerate(res):
	output[sensors[idx]] = map(lambda kv: json.loads(kv)[1] , sensordata)

# off we go
print "Content-Type: application/json"
print
print json.dumps(output)
