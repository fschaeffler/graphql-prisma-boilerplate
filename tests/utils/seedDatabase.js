import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
	input: {
		name: 'Tester',
		email: 'tester@test.com',
		password: bcrypt.hashSync('tester-pass-123')
	},
	user: undefined,
	jwt: undefined
};

const userTwo = {
	input: {
		name: 'retseT',
		email: 'retset@test.com',
		password: bcrypt.hashSync('retset-pass-123')
	},
	user: undefined,
	jwt: undefined
};

const seedDatabase = async () => {
	// delete test data
	await prisma.mutation.deleteManyUsers();

	// create user one
	userOne.user = await prisma.mutation.createUser({
		data: userOne.input
	});

	// create token for user one
	userOne.jwt = jwt.sign(
		{ userId: userOne.user.id },
		process.env.JWT_SECRET
	);

	// create user two
	userTwo.user = await prisma.mutation.createUser({
		data: userTwo.input
	});

	// create token for user one
	userTwo.jwt = jwt.sign(
		{ userId: userTwo.user.id },
		process.env.JWT_SECRET
	);
};

export { seedDatabase as default, userOne, userTwo };