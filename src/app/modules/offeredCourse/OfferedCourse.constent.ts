export const Days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
export const timeRegex = /^(0?[1-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
export const timeErrorMessage = 'Invalid time format. Expected format: HH:MM';
