const Route = require('../models/Route');
const Stop = require('../models/Stop');
const Bus = require('../models/Bus');

// Find routes between two stops
exports.findRoutes = (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'Both from and to parameters are required' });
    }

    const stops = Stop.getAllStops();
    const routes = Route.getAllRoutes();
    const buses = Bus.getAllBuses();

    // Find stops that match the query (case-insensitive partial match)
    const fromStop = stops.find(s => 
      s.name.toLowerCase().includes(from.toLowerCase()) ||
      s.location.toLowerCase().includes(from.toLowerCase())
    );
    
    const toStop = stops.find(s => 
      s.name.toLowerCase().includes(to.toLowerCase()) ||
      s.location.toLowerCase().includes(to.toLowerCase())
    );

    if (!fromStop || !toStop) {
      return res.status(404).json({ 
        error: 'Stops not found',
        availableStops: stops.map(s => ({ id: s.id, name: s.name, location: s.location }))
      });
    }

    // Find direct routes
    const directRoutes = findDirectRoutes(routes, buses, stops, fromStop.id, toStop.id);
    
    // Find routes with one transfer
    const transferRoutes = findTransferRoutes(routes, buses, stops, fromStop.id, toStop.id);

    const allRoutes = [...directRoutes, ...transferRoutes]
      .sort((a, b) => a.totalFare - b.totalFare);

    res.json({
      from: fromStop,
      to: toStop,
      routes: allRoutes.slice(0, 10), // Return top 10 routes for better options
      totalRoutes: allRoutes.length
    });

  } catch (error) {
    console.error('Route finding error:', error);
    res.status(500).json({ error: 'Failed to find routes' });
  }
};

// Get all stops with their route connectivity information
exports.getAllStopsWithRoutes = (req, res) => {
  try {
    const stops = Stop.getAllStops();
    const routes = Route.getAllRoutes();
    const buses = Bus.getAllBuses();

    const stopsWithRoutes = stops.map(stop => {
      // Find all routes that serve this stop
      const servingRoutes = routes.filter(route => 
        route.stops.some(routeStop => routeStop.stopId === stop.id)
      ).map(route => {
        const bus = buses.find(b => b.id === route.busId);
        const stopOnRoute = route.stops.find(rs => rs.stopId === stop.id);
        
        return {
          routeId: route.id,
          routeName: route.name,
          busNumber: bus?.number || 'N/A',
          busType: bus?.type || 'Standard',
          frequency: route.frequency,
          order: stopOnRoute?.order || 0,
          arrivalTime: stopOnRoute?.arrivalTime,
          departureTime: stopOnRoute?.departureTime
        };
      });

      return {
        ...stop,
        routeCount: servingRoutes.length,
        servingRoutes: servingRoutes.sort((a, b) => a.order - b.order)
      };
    });

    res.json({
      stops: stopsWithRoutes.sort((a, b) => b.routeCount - a.routeCount), // Most connected stops first
      totalStops: stopsWithRoutes.length
    });

  } catch (error) {
    console.error('Error fetching stops with routes:', error);
    res.status(500).json({ error: 'Failed to fetch stops data' });
  }
};

// Find direct routes between two stops
function findDirectRoutes(routes, buses, stops, fromStopId, toStopId) {
  const directRoutes = [];

  for (const route of routes) {
    const fromIndex = route.stops.findIndex(s => s.stopId === fromStopId);
    const toIndex = route.stops.findIndex(s => s.stopId === toStopId);

    // Allow both forward and backward travel on the same route
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      const bus = buses.find(b => b.id === route.busId);
      
      // Determine direction and slice accordingly
      const isForward = fromIndex < toIndex;
      const startIdx = Math.min(fromIndex, toIndex);
      const endIdx = Math.max(fromIndex, toIndex);
      const routeStops = route.stops.slice(startIdx, endIdx + 1);
      
      // If backward, reverse the stops and times
      if (!isForward) {
        routeStops.reverse();
      }

      // Calculate distance
      let distance = 0;
      for (let i = startIdx; i < endIdx; i++) {
        distance += calculateDistance(
          stops.find(s => s.id === route.stops[i].stopId),
          stops.find(s => s.id === route.stops[i + 1].stopId)
        );
      }

      const fare = Math.round(distance * (bus?.farePerKm || 1.2));
      
      // Calculate duration based on actual direction
      const departureTime = isForward ? route.stops[fromIndex].departureTime : route.stops[fromIndex].arrivalTime;
      const arrivalTime = isForward ? route.stops[toIndex].arrivalTime : route.stops[toIndex].departureTime;
      const duration = calculateDuration(departureTime, arrivalTime);

      directRoutes.push({
        type: 'direct',
        routeName: route.name,
        busNumber: bus?.number || 'N/A',
        busType: bus?.type || 'Unknown',
        direction: isForward ? 'forward' : 'return',
        stops: routeStops.map(s => ({
          ...s,
          stopName: stops.find(st => st.id === s.stopId)?.name || 'Unknown'
        })),
        distance: Math.round(distance),
        duration,
        totalFare: fare,
        frequency: route.frequency,
        amenities: bus?.amenities || [],
        departureTime,
        arrivalTime
      });
    }
  }

  return directRoutes;
}

// Find routes with one transfer
function findTransferRoutes(routes, buses, stops, fromStopId, toStopId) {
  const transferRoutes = [];

  for (const route1 of routes) {
    const fromIndex1 = route1.stops.findIndex(s => s.stopId === fromStopId);
    if (fromIndex1 === -1) continue;

    // Consider all stops on route1 as potential transfer points
    for (let i = 0; i < route1.stops.length; i++) {
      if (i === fromIndex1) continue; // Skip the starting point
      
      const transferStopId = route1.stops[i].stopId;

      for (const route2 of routes) {
        if (route1.id === route2.id) continue;

        const transferIndex2 = route2.stops.findIndex(s => s.stopId === transferStopId);
        const toIndex2 = route2.stops.findIndex(s => s.stopId === toStopId);

        if (transferIndex2 !== -1 && toIndex2 !== -1 && transferIndex2 !== toIndex2) {
          const bus1 = buses.find(b => b.id === route1.busId);
          const bus2 = buses.find(b => b.id === route2.busId);

          // Calculate first segment (can be forward or backward)
          const isForward1 = fromIndex1 < i;
          const startIdx1 = Math.min(fromIndex1, i);
          const endIdx1 = Math.max(fromIndex1, i);
          
          let distance1 = 0;
          for (let j = startIdx1; j < endIdx1; j++) {
            distance1 += calculateDistance(
              stops.find(s => s.id === route1.stops[j].stopId),
              stops.find(s => s.id === route1.stops[j + 1].stopId)
            );
          }

          // Calculate second segment (can be forward or backward)
          const isForward2 = transferIndex2 < toIndex2;
          const startIdx2 = Math.min(transferIndex2, toIndex2);
          const endIdx2 = Math.max(transferIndex2, toIndex2);

          let distance2 = 0;
          for (let j = startIdx2; j < endIdx2; j++) {
            distance2 += calculateDistance(
              stops.find(s => s.id === route2.stops[j].stopId),
              stops.find(s => s.id === route2.stops[j + 1].stopId)
            );
          }

          const fare1 = Math.round(distance1 * (bus1?.farePerKm || 1.2));
          const fare2 = Math.round(distance2 * (bus2?.farePerKm || 1.2));

          // Calculate times based on direction
          const dep1 = isForward1 ? route1.stops[fromIndex1].departureTime : route1.stops[fromIndex1].arrivalTime;
          const arr1 = isForward1 ? route1.stops[i].arrivalTime : route1.stops[i].departureTime;
          const dep2 = isForward2 ? route2.stops[transferIndex2].departureTime : route2.stops[transferIndex2].arrivalTime;
          const arr2 = isForward2 ? route2.stops[toIndex2].arrivalTime : route2.stops[toIndex2].departureTime;

          // Add transfer waiting time (minimum 10 minutes)
          const waitTime = calculateWaitTime(arr1, dep2);
          if (waitTime > 120) continue; // Skip if waiting time is more than 2 hours

          transferRoutes.push({
            type: 'transfer',
            segments: [
              {
                routeName: route1.name,
                busNumber: bus1?.number || 'N/A',
                busType: bus1?.type || 'Unknown',
                direction: isForward1 ? 'forward' : 'return',
                from: stops.find(s => s.id === fromStopId)?.name,
                to: stops.find(s => s.id === transferStopId)?.name,
                distance: Math.round(distance1),
                fare: fare1,
                departureTime: dep1,
                arrivalTime: arr1
              },
              {
                routeName: route2.name,
                busNumber: bus2?.number || 'N/A',
                busType: bus2?.type || 'Unknown',
                direction: isForward2 ? 'forward' : 'return',
                from: stops.find(s => s.id === transferStopId)?.name,
                to: stops.find(s => s.id === toStopId)?.name,
                distance: Math.round(distance2),
                fare: fare2,
                departureTime: dep2,
                arrivalTime: arr2
              }
            ],
            transferPoint: stops.find(s => s.id === transferStopId)?.name,
            waitTime: `${waitTime}m`,
            totalDistance: Math.round(distance1 + distance2),
            totalFare: fare1 + fare2,
            totalDuration: calculateDuration(dep1, arr2)
          });
        }
      }
    }
  }

  return transferRoutes.sort((a, b) => a.totalFare - b.totalFare);
}

// Calculate distance between two stops (simplified - using straight line distance)
function calculateDistance(stop1, stop2) {
  if (!stop1 || !stop2 || !stop1.coordinates || !stop2.coordinates) return 5; // Default 5km
  
  const R = 6371; // Earth's radius in km
  const dLat = (stop2.coordinates.lat - stop1.coordinates.lat) * Math.PI / 180;
  const dLon = (stop2.coordinates.lng - stop1.coordinates.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(stop1.coordinates.lat * Math.PI / 180) * Math.cos(stop2.coordinates.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate duration between two times
function calculateDuration(startTime, endTime) {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
  if (duration < 0) duration += 24 * 60; // Handle overnight trips
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

// Calculate waiting time between arrival and departure (for transfers)
function calculateWaitTime(arrivalTime, departureTime) {
  const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
  const [depHour, depMin] = departureTime.split(':').map(Number);
  
  let wait = (depHour * 60 + depMin) - (arrHour * 60 + arrMin);
  if (wait < 0) wait += 24 * 60; // Handle overnight waiting
  if (wait < 10) wait += 10; // Minimum 10 minutes transfer time
  
  return wait;
}

module.exports = exports;
