"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toRadians = toRadians;
exports.calculateDistance = calculateDistance;
function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = toRadians(latitude2 - latitude1);
    const dLon = toRadians(longitude2 - longitude1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(latitude1)) *
            Math.cos(toRadians(latitude2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
}
