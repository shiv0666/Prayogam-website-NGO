const withEventSlots = (eventDoc) => {
  const event = eventDoc.toObject ? eventDoc.toObject() : eventDoc;
  const totalFromField = Number(event.totalVolunteersRequired || 0);
  const totalFromLegacy = Number(event?.requirements?.volunteersNeeded || 0);
  const totalVolunteersRequired = Math.max(0, totalFromField || totalFromLegacy);
  const currentApprovedVolunteers = Math.max(0, Number(event.currentApprovedVolunteers || 0));
  const remainingVolunteers = Math.max(0, totalVolunteersRequired - currentApprovedVolunteers);

  return {
    ...event,
    totalVolunteersRequired,
    currentApprovedVolunteers,
    remainingVolunteers
  };
};

module.exports = { withEventSlots };
