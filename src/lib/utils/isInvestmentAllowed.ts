const isInvestmentAllowed = (userType: string, schemePlan: string) => {
	return !(
		(userType === 'B2C' && schemePlan?.toUpperCase() === 'REGULAR') ||
		(userType === 'B2B' && schemePlan?.toUpperCase() === 'DIRECT')
	);
};

export default isInvestmentAllowed;
