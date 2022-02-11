import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import styles from './search.module.css';
import { getPredictions, getOptions, addToHistory, getHistory } from './searchSlice'
import { useSelector, useDispatch } from 'react-redux';

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.
const GOOGLE_MAPS_API_KEY = 'AIzaSyCB-O-KPzRl4MmEYnZOik691XM0CZiE_CE';

function loadScript(url, position, callback) {
    if (!position) {
        return;
    }
    let script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = () => callback();
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

const autocompleteService = { current: null };
let map, marker
let serviceDetails
export default function SearchPlacesWithRedux() {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const options = useSelector(getOptions);
    const loaded = React.useRef(false);
    const mapRef = React.useRef(null);
    const dispatch = useDispatch()
    const searchHistory = useSelector(getHistory)
    React.useEffect(() => {
        if (typeof window !== 'undefined' && !loaded.current && !window.google) {
            if (!document.querySelector('#google-maps')) {
                loadScript(
                    `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
                    document.querySelector('head'),
                    mapInit
                );
            }
            loaded.current = true;
        }
    }, [])
    const fetchPredictions = React.useMemo(
        () =>
            throttle((dispatch,inputValue, value) => {
                dispatch(getPredictions({ ...autocompleteService, inputValue, value, updateMap }))
            }, 200),
        [],
    );
    function mapInit() {
        map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 48, lng: 4 },
            mapTypeControl: false,
            zoom: 4,
            disableDefaultUI: true
        });
        marker = new window.google.maps.Marker({
            map,
            anchorPoint: new window.google.maps.Point(0, -20),
        });
    }
    function updateMap(place_id, status) {
        if (serviceDetails) {
            let request = {
                placeId: place_id,
                fields: ['name', 'geometry']
            };
            serviceDetails.getDetails(request, function (place, status) {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    var bounds = new window.google.maps.LatLngBounds();
                    marker.setPosition(place.geometry.location);
                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                    map.fitBounds(bounds);
                }
            });
        }
    }
    React.useEffect(() => {
        let active = true;
        if (!autocompleteService.current && window.google) {
            mapInit()
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            serviceDetails = new window.google.maps.places.PlacesService(map);
        }
        if (!autocompleteService.current) {
            return undefined;
        }
        if (inputValue === '') {
            return undefined;
        }
        if (active) {
            fetchPredictions(inputValue, value)
        }
        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);
    function renderList(props, option) {
        if(option) {
            const matches = option.structured_formatting.main_text_matched_substrings;
            const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match) => [match.offset, match.offset + match.length]),
            );
            return (
                <li {...props}>
                    <Grid container alignItems="center">
                        <Grid item>
                        </Grid>
                        <Grid item xs>
                            {parts.map((part, index) => (
                                <span
                                    key={index}
                                    style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                    }}
                                >
                                    {part.text}
                                </span>
                            ))}
    
                            <Typography variant="body2" color="text.secondary">
                                {option.structured_formatting.secondary_text}
                            </Typography>
                        </Grid>
                    </Grid>
                </li>
            );
        }
    }
    return (
        <>
            <div className={styles.google_combo_search}>
                <h2>Search With Redux</h2>
                <div className={styles.google_combo_map}>

                    <Autocomplete
                        id="google-map-demo"
                        sx={{ width: 300 }}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.description
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        value={value}
                        onChange={(event, newValue) => {
                            console.log({ newValue, options })
                            // setOptions(newValue ? [newValue, ...options] : options);
                            setValue(newValue);
                            dispatch(addToHistory(newValue))
                        }}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Search Location" fullWidth />
                        )}
                        renderOption={(props, option) => {
                            return renderList(props, option)
                        }}
                    />
                    <div className={styles.map_container}>
                        <div ref={mapRef} className={styles.map_block} />
                        <div className={styles.history_block}>
                            <h3>User History</h3>
                            <ul className={styles.user_history}>
                                {searchHistory.map((list) => {
                                    return (
                                        renderList({}, list)
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
