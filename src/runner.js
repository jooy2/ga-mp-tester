import axios from 'axios';
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import * as randomUseragent from 'random-useragent';
import eventDefs from '../event_defs.json' assert { type: 'json' };

dotenv.config();

const createClientID = () => {
	// Create random Google gtag client id
	// 	- GA1.1.00000000.0000000000
	const num1 = Math.floor(Math.random() * 10000000 + 1);
	const num2 = Math.floor(Math.random() * 1000000000 + 1);

	return `GA1.1.${num1}.${num2}`;
};

const sleep = (delay) =>
	new Promise((resolve) => {
		setTimeout(resolve, delay);
	});

const log = (data) => {
	const { env } = process;

	if (env.LOGGING !== 'true' || !data) {
		return;
	}

	console.log(data);
};

const track = async (currentUid, currentCid, requestNo) => {
	const { env } = process;

	const requestData = JSON.stringify({
		client_id: currentCid,
		user_id: currentUid,
		...(env.DEBUG_MODE === 'true' ? { debug_mode: true } : {}),
		// See `event_defs.json5` file
		events: eventDefs.map((x) => {
			const newEventData = x;

			if (newEventData.params) {
				// Adding common data to event data
				if (!newEventData.params.engagement_time_msec) {
					// Values to properly measure user data
					newEventData.params.engagement_time_msec = '1';
				}
			}

			return newEventData;
		})
	});
	const userAgent = randomUseragent.getRandom();

	log(`Request #${requestNo + 1} -> ${requestData} (${userAgent})`);

	await axios
		.post(
			`https://www.google-analytics.com/mp/collect?measurement_id=${env.MEASUREMENT_ID}&api_secret=${env.API_SECRET}`,
			requestData,
			{
				headers: {
					'User-Agent': userAgent,
					'Content-Type': 'application/json'
				}
			}
		)
		.catch((e) => {
			log(`Request error: ${e}`);
		});
};

const main = async () => {
	const { env } = process;

	if (Object.keys(env).length < 1 || !env.MEASUREMENT_ID || !env.API_SECRET) {
		throw new Error('No .env file preferences were found.');
	}

	let currentCid;
	let currentUid;
	const sendAmount = env.SEND_AMOUNT || 1;

	for (let i = 0; i < sendAmount; i += 1) {
		if (!currentUid || !currentCid || env.SINGLE_USER !== 'true') {
			currentCid = createClientID();
			currentUid = uuid.v4();
			log(`New user's session created: [UID: ${currentUid} / CID: ${currentCid}]`);
		}

		await track(currentUid, currentCid, i);

		if (sendAmount > 1) {
			await sleep(env.NEXT_REQUEST_WAITING_TIME_MILLISEC || 1000);
		}
	}
};

(async () => {
	await main();
})();
