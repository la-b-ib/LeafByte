export function calculateCarbonFootprint(dataUsageMB, energyPerMB = 0.005, carbonIntensity = 0.4) {
    const energyConsumed = dataUsageMB * energyPerMB; // kWh
    const emissions = energyConsumed * carbonIntensity; // kg CO2
    return {
      dataUsageMB,
      energyConsumed: energyConsumed.toFixed(3),
      carbonIntensity,
      emissions: emissions.toFixed(3),
      equivalentKmDriven: (emissions / 0.21).toFixed(2), // average 0.21 kg CO2/km
      treeEquivalent: (emissions / 21).toFixed(2) // one tree absorbs ~21 kg/year
    };
  }
  