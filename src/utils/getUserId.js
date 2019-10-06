import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
	const authHeader = request.request ?
		request.request.headers.authorization :
		request.connection.context.Authorization;

	if (authHeader) {
		const token = authHeader.replace('Bearer ', '');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		return decoded.userId;
	}

	if (requireAuth === true) {
		throw new Error('Authentication required.')
	}

	return null;
};

export { getUserId as default };