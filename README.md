# Driverless Cockpit Backend

Backend application for municHMotorsport's driverless monitoring tool. It acts...

+ ...as an interface for client applications to access live data from the vehicle.
+ ...as an API that offers recording functionality and handles caching,  persistence and retrieval of recorded data.

## Setup

### System requirements

+ Node.js v6.2.2 or higher
+ Bower
+ MongoDB v3.2.3

### Preparations

#### Dummy Data

The current version of Driverless Cockpit does not support network connections to a real car. It therefore relies on previously generated mockup data that is stored in a CSV file on your local machine. The structure of the file must look like this:

| timestamp [s] | steeringWheelAngle [rad] | pathMiddleLineX [m] | pathMiddleLineY [m] | vehicleX [m] | vehicleY [m] | vehicleVX [m/s] | vehicleVY [m/s] | vehicleYawrate [1/s] | frontwheelLeftAngle [rad] | frontwheelRightAngle [rad] |
|---------------|--------------------------|---------------------|---------------------|--------------|--------------|-----------------|-----------------|----------------------|---------------------------|----------------------------|
| 0 | 0 | 2.0992 | -0.052198 | 0.94976 | -0.019921 | 0 | 0 | -1.45E-11 | -4.79E-08 | 5.40E-08 |
| 0.1 | -0.67156 | 2.0993 | -0.0522 | 0.94973 | -0.019889 | -0.00028446 | 0.00041255 | 3.09E-05 | -0.25194 | -0.26369 |
| 0.2 | -0.17308 | 2.1296 | -0.053375 | 0.97837 | -0.021429 | 0.69818 | -0.022324 | -0.0301 | -0.066667 | -0.064819 || 0.3 | -0.088225 | 2.2541 | -0.058367 | 1.1025 | -0.025874 | 1.7887 | -0.028839 | -0.040342 | -0.035257 | -0.031809 |
| 0.4 | -0.0634 | 2.4972 | -0.068916 | 1.3454 | -0.034595 | 3.0327 | -0.03397 | -0.048808 | -0.026019 | -0.022221 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | 

Download a sample file [here](http://argonn.me/share/driverless-cockpit-dummy-v2.csv).

**Important:** You must specify the path to the file on your local machine in the environment variable `FSD_MOCKDATA_PATH`.

#### MongoDB instance

Make sure you have a running `mongod` instance on standard mongo port: `localhost:27017` before attempting to start the app.

#### Optional: Cache length

When recording data, each timeframe is cache in-memory for 30000 ms (30 seconds) by default. Change the cache length by setting the environment variable `FSD_CACHE_TTL` to an integer value (in ms).

### Run the app

Start the app by hitting `npm start` in the app's root directory.

Access the API at `http://localhost:3000/`.

## API Documentation

### `GET /appstate`

Returns information about the current status of the application:

```
{
	"activeRecording": null || {		// null if no recording active
		"id": <ObjectID>,				// ID of active recording
		"start": <Integer>				// start of recording (epoch timestamp)
	},
	"connected": <Boolean>,				// is app connected to car?
	"recording": <Boolean>				// is app currently recording?
}
```

### `GET /livestats`

Returns the last timeframe the car has sent. Example:

```
{
	"timestamp": 1521115708789,
	"steerAngle": -0.27185,
	"pathMiddleX": 16.692,
	"pathMiddleY": -6.0516,
	"vehicleX": 16.311,
	"vehicleY": -4.8649,
	"vehicleVelocityX": 9.8645,
	"vehicleVelocityY": -0.3053,
	"vehicleRotation": -0.6226,
	"frontwheelLeftRotation": -0.10325,
	"frontwheelRightRotation": -0.10341
}
```

### `GET /recording/start`

Start a new recording. Returns:

+ Application status object similar to `/appstate` if recording started sucessfully
+ HTTP 500 error if something went wrong

### `GET /recording/active/:since`

Get all frames newer than `:since` of active recording.

#### Params

+ `:since` - epoch timestamp, usually the newest timeframe your client app has received

#### Returns

```
{
	"id": <ObjectID>,						// ID of active recording
	"start": <Integer>,						// start time of active recording (epoch timestamp)
	"chunk": {
		"first": <Integer>,					// timestamp of first frame included in response
		"last": <Integer>					// timestamp of last frame included in response
	},
	"frames": [								// frames as in /livestats, sorted ascending by timestamp 
		{
			"steerAngle": 0.38624,
			"pathMiddleX": 11.741,
			"pathMiddleY": 31.235,
			"vehicleX": 12.93,
			"vehicleY": 30.466,
			"vehicleVelocityX": 9.5709,
			"vehicleVelocityY": 0.43311,
			"vehicleRotation": 0.95815,
			"frontwheelLeftRotation": 0.14871,
			"frontwheelRightRotation": 0.14665,
			"timestamp": 1521116122009
		},
		...
	]
}	
```

### `/recording/stop`

Stop active recording. Returns:

+ Application status object similar to `/appstate` if recording stopped sucessfully
+ HTTP 500 error if something went wrong

### `/recordings`

Returns a list of all recordings stored in the database.

```
[
	{
		"_id": <ObjectID>,				// ID of recording
		"start": <Integer>,				// start time (epoch)
		"end": null || <Integer>,		// end time (epoch)
		"writeActive": <Boolean>		// true if this is the active recording
	},
	...
]	
```
