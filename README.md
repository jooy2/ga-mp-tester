# Google Analytics Measurement Protocol Tester

Request data manually with this script file and the Google Analytics 4 Measurement Protocol. You can easily send data with pre-prepared settings that allow you to include repetitive dummy data.

Built for Google Analytics 4.

## How to use

This project requires a **[Node.js](https://nodejs.org)** (18.x or higher) installation to configure.

For a detailed description of the Measurement Protocol API, see the links below.

https://developers.google.com/analytics/devguides/collection/protocol/ga4

First, clone this project. Then create an `.env` file in the root of your project. This file should be properly organized to match the template below.

```dotenv
MEASUREMENT_ID=G-**********
API_SECRET=**********************
SEND_AMOUNT=1
NEXT_REQUEST_WAITING_TIME_MILLISEC=1000
SINGLE_USER=true
LOGGING=true
DEBUG_MODE=false
```

For an example file, see `.env.example`. This file is not involved in the actual behavior.

- `MEASUREMENT_ID`: GA4 tracking code (with `G-`)
- `API_SECRET`: Measurement protocol API password
- `SEND_AMOUNT`: The number of times to send data repeatedly. If no value, defaults to `1`.
- `NEXT_REQUEST_WAITING_TIME_MILLISEC`: Request latency when the following data needs to be sent (Milliseconds)
- `SINGLE_USER`: Set this value to `true` if you don't want the UID/CID to be different per request
- `LOGGING`: Set this to `true` to see the request body and other progress in the console
- `DEBUG_MODE`: Set this value to `true` to be sent as GA4 debug monitoring data. If `true`, it will not be added as actual report data and will only be displayed in `debugView`. (https://support.google.com/analytics/answer/7201382)

The GA 4 event parameter values used when sending requests can be written in the `event_defs.json` file in the project root:

```json5
[
	{
		name: 'page_view', // Event name
		params: {
			// Event parameters
			page_location: '/', // Page path
			page_title: 'Page Name' // Page title
			// "your_custom_dimension_1": "hello",
			// "your_custom_dimension_2": "world",
		}
	}
]
```

When you manually send a data request, the UID/CID and associated data is sent along with the actual report so that it can be displayed in the real-time dashboard. This process is handled automatically by the script, but the UID/CID might be different from what you actually require.

Once you're done, send the request via the `npm` command below.

```shell
$ npm run start
```

## Contributing

Anyone can contribute to the project by reporting new issues or submitting a pull request. For more information, please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Please see the [LICENSE](LICENSE) file for more information about project owners, usage rights, and more.
