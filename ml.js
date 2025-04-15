// Example of a simple machine learning function (e.g., predicting emissions based on data usage)
function predictCarbonEmissions(dataUsageMB) {
    const predictionModel = {
      intercept: 0.4,
      slope: 0.2
    };
    return predictionModel.intercept + predictionModel.slope * dataUsageMB;
  }
  
  function calculateMLPredictedEmission(dataUsageMB) {
    return predictCarbonEmissions(dataUsageMB).toFixed(2);
  }
  