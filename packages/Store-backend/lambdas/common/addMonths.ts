interface AddMonthsProps extends Omit<MainFunctionProps, "arg"> {
  // Add your interface properties here
}
export const addMonths = (monthsToAdd = 1, currentDate = new Date()) => {
  const currentMonth = currentDate.getMonth();
  if (monthsToAdd + currentMonth >= 12) {
    const newMonth = monthsToAdd + currentMonth - 12;
    currentDate.setFullYear(currentDate.getFullYear() + 1, newMonth);
    console.log(currentDate);
  } else {
    const newMonth = monthsToAdd + currentMonth;
    currentDate.setMonth(newMonth);
    return currentDate;
  }
};
