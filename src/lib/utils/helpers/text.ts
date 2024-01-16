export const getNameInitials = (name: string) => {
	if (!name?.length) {
		return ' ';
	}

	if (name?.includes(' ')) {
		const nameArray = name?.split(' ');
		const firstLetter = nameArray[0][0];
		const lastLetter = nameArray[nameArray?.length - 1][0];
		return `${firstLetter}${lastLetter}`;
	} else {
		return name[0];
	}
};
