
export const  getPredictionSuggestion = (info) => {
    let {current: predictionService, inputValue, value, updateMap: callback} = info
    return new Promise(function(resolve, reject) {
        predictionService.getPlacePredictions( { input: inputValue }, function (results, status) {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                reject(new Error(status));
            } else {
                let newOptions = [];
                if (value) {
                    newOptions = [value];
                    callback(value.place_id, status)
                }
                if (results) {
                    newOptions = [...newOptions, ...results];
                }
                resolve(newOptions);
            }
        });
    });
}