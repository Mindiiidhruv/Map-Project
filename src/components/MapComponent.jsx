// src/components/MapComponent.jsx

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { getDistance } from 'geolib';

const LocationSelector = ({ setPickup, setDrop }) => {
  useMapEvents({
    click(e) {
      if (!setPickup.current) {
        // Set pickup location on the first click
        setPickup.current = e.latlng;
      } else if (!setDrop.current) {
        // Set drop location on the second click
        setDrop.current = e.latlng;
      }
    },
  });
  return null;
};

const MapComponent = () => {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [message, setMessage] = useState('Select the pickup location!');

  const getTravelTimes = (distanceInMeters) => {
    const km = distanceInMeters / 1000;
    return {
      walk: `${Math.round(km / 5 * 60)} mins`,  // Walking speed: 5 km/h
      bike: `${Math.round(km / 15 * 60)} mins`, // Biking speed: 15 km/h
      car: `${Math.round(km / 40 * 60)} mins`,  // Driving speed: 40 km/h
    };
  };

  // Calculate the distance between pickup and drop locations
  const distance = pickup && drop ? getDistance(pickup, drop) : null;
  const times = distance ? getTravelTimes(distance) : null;

  return (
    <div>
      <h2>Distance & Travel Time Calculator</h2>
      <p>{message}</p>

      <MapContainer
        center={[28.6139, 77.2090]}  // Default location: New Delhi
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Location Selector for Pickup and Drop */}
        <LocationSelector setPickup={setPickup} setDrop={setDrop} />

        {/* Markers for Pickup and Drop */}
        {pickup && (
          <Marker position={pickup}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        {drop && (
          <Marker position={drop}>
            <Popup>Drop Location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Display Distance and Time Estimates */}
      {distance && (
        <div style={{ marginTop: '20px' }}>
          <h3>Distance: {(distance / 1000).toFixed(2)} km</h3>
          <p>🚶 Walking time: {times.walk}</p>
          <p>🚴 Biking time: {times.bike}</p>
          <p>🚗 Driving time: {times.car}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
