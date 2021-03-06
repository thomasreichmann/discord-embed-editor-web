import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import firebaseConfig from './config';
import { TokenResponse } from '../../services/auth.d';

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

if (process.env.NODE_ENV === 'development') {
	connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Functions from firebase
const generateToken = httpsCallable(functions, 'generateToken');
const getUserGuilds = httpsCallable(functions, 'getGuilds');

export async function requestToken(code: string) {
	let response = await generateToken({ code });
	return JSON.parse(response.data as string) as TokenResponse;
}

export async function getGuilds(token: string) {
	let response = await getUserGuilds({ discord_token: token });
	return response.data as Guild[];
}

// TODO: export this type to a seperate decleration file
export interface Guild {
	id: string;
	name: string;
	icon: string;
	owner: boolean;
	permissions: string;
	features: string[];
}
