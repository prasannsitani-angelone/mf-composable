export const getNameInitials = (name: string) => {
	const nameArr = name.split(' ');
	return `${nameArr[0]?.trim() ? nameArr[0]?.trim()[0] : ''} ${
		nameArr[2]?.trim() ? nameArr[2]?.trim()[0] : ''
	}`;
};
