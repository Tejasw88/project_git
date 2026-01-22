export const getWalkingDirectionsUrl = (lat, lng) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
};

export const getInstructionString = (loc) => {
    return `After reaching the building: Block ${loc.block}, Floor ${loc.floor}, Room ${loc.room}`;
};
