import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import getUserId from '../utils/getUserId';
import hashPassword from '../utils/hashPassword';

const Mutation = {
	async createUser (parent, args, { prisma }, info) {
		const password = await hashPassword(args.data.password);

		const user = await prisma.mutation.createUser({
			data: {
				...args.data,
				password
			}
		});

		return {
			token: generateToken(user.id),
			user
		};
	},
	deleteUser (parent, args, { prisma, request }, info) {
		const userId = getUserId(request);
	
		return prisma.mutation.deleteUser({
			where: {
				id: userId
			}
		}, info);
	},
	async updateUser (parent, args, { prisma, request }, info) {
		const userId = getUserId(request);

		if (typeof args.data.password === 'string') {
			args.data.password = await hashPassword(args.data.password);
		}

		return prisma.mutation.updateUser({
			where: {
				id: userId
			},
			data: args.data
		}, info);
	},
	async loginUser (parent, args, { prisma }, info) {
		const { email, password } = args.data;

		const user = await prisma.query.user({ where: { email } });
		const isPasswordMatch = user && await bcrypt.compare(password, user.password);
		if (!user || !isPasswordMatch) {
			throw new Error('Not authorized.');
		}

		return {
			token: generateToken(user.id),
			user
		}
	}
};

export { Mutation as default };