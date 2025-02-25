export function calculateHoursWorked(checkIn, checkOut) {
  const checkInTime = new Date(checkIn);
  const checkOutTime = new Date(checkOut);
  const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
  return hoursWorked;
}

export function generateWeeklyReport(userRecords) {
  const report = userRecords.map(record => {
    const totalHours = record.sessions.reduce((acc, session) => {
      if (session.checkIn && session.checkOut) {
        return acc + calculateHoursWorked(session.checkIn, session.checkOut);
      }
      return acc;
    }, 0);
    return `User: ${record.whatsappNumber}, Total Hours: ${totalHours.toFixed(2)}`;
  }).join('\n');
  return report;
}
