import 'cross-fetch/polyfill';
import '@babel/polyfill/noConflict';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, getUsers, loginUser, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
	const variables = {
		data: {
			name: 'Florian',
			email: 'test-user@test.com',
			password: 'test-pass-123'
		}		
	};

	const response = await client.mutate({
		mutation: createUser,
		variables
	});

	const userExists = await prisma.exists.User({
		id: response.data.createUser.user.id
	});

	expect(userExists).toBe(true);
});

test('Should not sign up user with invalid password', async () => {
	const variables = {
		data: {
			name: 'Florian',
			email: 'test-user@test.com',
			password: 'ab11cc'
		}
	}

	await expect(
		client.mutate({
			mutation: createUser,
			variables
		})
	).rejects.toThrow();
});

test('Should not login with bad credentials', async () => {
	const variables = {
		data: {
			email: 'not-existant@test.com',
			password: 'not-right'
		}
	};

	await expect(
		client.mutate({
			mutation: loginUser,
			variables
		})
	).rejects.toThrow();
});

test('Should expose public author profiles', async () => {
	const response = await client.query({ query: getUsers });

	expect(response.data.users.length).toBe(2);
	expect(response.data.users[0].email).toBe(null);
	expect(response.data.users[0].name).toBe('Tester');
});

test('Should fetch user profile', async () => {
	const client = getClient(userOne.jwt);
	const { data } = await client.query({ query: getProfile });

	expect(data.me.id).toBe(userOne.user.id);
	expect(data.me.name).toBe(userOne.user.name);
	expect(data.me.email).toBe(userOne.user.email);
});