/**
 * Gets all occurrences of events for a specific date.
 * @param {Date} date The date to check for occurrences.
 * @param {Array} allEvents All base events from storage.
 * @returns {Array} An array of event objects that occur on the given date.
 */
export function getEventOccurrencesForDate(date, allEvents) {
  const occurrences = [];
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  for (const event of allEvents) {
    const eventStart = new Date(event.startDate + 'T00:00:00');
    eventStart.setHours(0, 0, 0, 0);

    const eventEnd = new Date(event.endDate + 'T00:00:00');
    eventEnd.setHours(0, 0, 0, 0);

    // Handle multi-day non-recurring events
    if (event.recurrence.rule === "none" || !event.recurrence.rule) {
      if (checkDate >= eventStart && checkDate <= eventEnd) {
        occurrences.push(event);
      }
      continue;
    }

    // Handle recurring events
    const recurrenceUntil = event.recurrence.until
      ? new Date(event.recurrence.until)
      : null;
    if (recurrenceUntil) recurrenceUntil.setHours(23, 59, 59, 999);

    if (
      checkDate < eventStart ||
      (recurrenceUntil && checkDate > recurrenceUntil)
    ) {
      continue;
    }

    switch (event.recurrence.rule) {
      case "daily":
        occurrences.push(event);
        break;
      case "weekly":
        if (checkDate.getDay() === eventStart.getDay()) {
          occurrences.push(event);
        }
        break;
      case "monthly":
        if (checkDate.getDate() === eventStart.getDate()) {
          occurrences.push(event);
        }
        break;
      case "yearly":
        if (
          checkDate.getDate() === eventStart.getDate() &&
          checkDate.getMonth() === eventStart.getMonth()
        ) {
          occurrences.push(event);
        }
        break;
    }
  }
  return occurrences;
}
