import OpenAI from "openai";
import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
const { getJson } = require("serpapi");

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});


async function getLocation() {
    const response = await fetch("https://ipapi.co/json/");
    const locationData = await response.json();
    console.log(locationData);
    return locationData;
}

async function getCurrentWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
    const response = await fetch(url);
    const weatherData = await response.json();
    return weatherData;
}

async function searchGoogle(query, location) {
    let url = `http://localhost:4000/?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;
    console.log(url)
    const response = await fetch(url);
    const returnObject = await response.json()
    console.log(returnObject)
    const newObj = removeProperties(returnObject)
    console.log(newObj)
    return newObj;
}

function removeProperties(jsonObject){
    let newJsonObject = {...jsonObject};
    delete newJsonObject['serpapi_pagination']
    delete newJsonObject['pagination']
    delete newJsonObject['search_metadata']
    console.log(newJsonObject)
    return newJsonObject
}


const tools = [
    {
        type: "function",
        function: {
            name: "getCurrentWeather",
            description: "Get the current weather in a given location",
            parameters: {
                type: "object",
                properties: {
                    latitude: {
                        type: "string",
                    },
                    longitude: {
                        type: "string",
                    },
                },
                required: ["longitude", "latitude"],
            },
        }
    },
    {
        type: "function",
        function: {
            name: "getLocation",
            description: "Get the user's location based on their IP address",
            parameters: {
                type: "object",
                properties: {},
            },
        }
    },
      {
        type: "function",
        function: {
          name: "searchGoogle",
          description: "Search Google for a given query",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
              },
              location: {
                type: "string",
                description: "the location to search from in the format 'city, state'"
              },
            },
            required: ["query", "location"],
          },
        }
      },
];

const availableTools = {
    getCurrentWeather,
    getLocation,
    searchGoogle,
};

const messages = [
    {
        role: "system",
        content: `You are a helpful assistant. Only use the functions you have been provided with.`,
    },
];

async function agent(userInput) {
    messages.push({
        role: "user",
        content: userInput,
    });

    for (let i = 0; i < 5; i++) {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: messages,
            tools: tools,
            temperature: 0.3,
        });

        const { finish_reason, message } = response.choices[0];

        if (finish_reason === "tool_calls" && message.tool_calls) {
            const functionName = message.tool_calls[0].function.name;
            const functionToCall = availableTools[functionName];
            const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
            const functionArgsArr = Object.values(functionArgs);
            const functionResponse = await functionToCall.apply(
                null,
                functionArgsArr
            );

            messages.push({
                role: "function",
                name: functionName,
                content: `
                The result of the last function was this: ${JSON.stringify(
                    functionResponse
                )}
                `,
            });
        } else if (finish_reason === "stop") {
            messages.push(message);
            return message.content;
        }
    }
    return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
}

let globalMap = null

// Modal To display Google Map and Recommendation based on location and weather
const RecommendationModal = () => {
    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState("");
    const [currentLocation, setCurrentLocation] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [map, setMap] = useState(null);


    useEffect(() => {
        // Fetch current location and weather data
        const fetchData = async () => {
            const locationData = await getLocation();
            console.log(locationData)
            setCurrentLocation(locationData);
            const weatherData = await getCurrentWeather(locationData.latitude, locationData.longitude);
            setCurrentWeather(weatherData);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (open && map === null) {
            // If modal is open and map is not initialized yet
            const timeout = setTimeout(() => {
                initializeMap();
            }, 100);

            // Clean up function
            return () => clearTimeout(timeout);
        }
    }, [open, map]);

    const initializeMap = () => {

        console.log("Current location:", currentLocation);

        if (!currentLocation) {
            console.log("Current location is not available yet.");
            return;
        }

        if (typeof google === 'undefined') {
            // Google Maps API is not loaded yet, wait for it
            return;
        }

        const mapCenter = { lat: currentLocation.latitude, lng: currentLocation.longitude };
        console.log("mapCenter :", mapCenter);
        const mapElement = document.getElementById('google-map');
        console.log("Map element:", mapElement);
        if (!mapElement) {
            console.log("Map element:", mapElement);
            return;
        }

        const mapOptions = {
            center: mapCenter,
            zoom: 10,
        };
        globalMap = new window.google.maps.Map(mapElement, mapOptions);
        setMap(globalMap);

        const customMarkerIcon = {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: {
                width: 40,
                height: 40
            }
        }

        // Add marker
        new window.google.maps.Marker({
            position: mapCenter,
            map: globalMap,
            icon: customMarkerIcon,
            label: {
                text: 'You are Here',
                color: 'darkblue'
            }
        });

        // new window.google.maps.Marker({
        //     position: {lat: 41.9132, lng: -87.6485},
        //     map: map,
        //     icon: customMarkerIcon,
        //     label: {
        //         text: 'You are Here',
        //         color: 'darkblue'
        //     }
        // });
    };
    const handleClick = async () => {
        setOpen(true);
        const response = await agent(
            "Generate recommendations for restaurants, musical events/concerts, and sports events based on my location and weather along with their latitude and longitude coordinates and operating hours only in a JSON format. Include at least 3 options for each category. "
        );

        // const response = await agent(
        //     "Generate recommendations for restaurants, musical events/concerts, and sports events in Chicago. Include at least 3 options for each category."
        // );

        console.log(response)
        const match = response.match(/\{(?:[^{}]|{[^{}]*})*\}/);
        let formattedResponse = parseString(match[0])

        setResponse(formattedResponse);

    };

    const parseString = (str) => {

        // console.log(results)
        let results = JSON.parse(str);
        
        const restaurants = results['restaurants'];
        const musicalEvents = results['musical_events'];
        const sportsEvents = results['sports_events'];

        const customMarkerIcon1 = {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: {
                width: 40,
                height: 40
            }
        }

        const customMarkerIcon2 = {
            url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
            scaledSize: {
                width: 40,
                height: 40
            }
        }

        const customMarkerIcon3 = {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: {
                width: 40,
                height: 40
            }
        }

        restaurants.forEach(restaurant => {
            console.log(restaurant)
            new window.google.maps.Marker({
                position: {lat: parseFloat(restaurant.latitude), lng: parseFloat(restaurant.longitude)},
                icon: customMarkerIcon1,
                map: globalMap,
                title: restaurant.name,
            })
        });

        musicalEvents.forEach(musicalEvent => {
            console.log(musicalEvent)
            new window.google.maps.Marker({
                position: {lat: parseFloat(musicalEvent.latitude), lng: parseFloat(musicalEvent.longitude)},
                icon: customMarkerIcon2,
                map: globalMap,
                title: musicalEvent.name,
            })
        });

        sportsEvents.forEach(sportsEvent => {
            console.log(sportsEvent)
            new window.google.maps.Marker({
                position: {lat: parseFloat(sportsEvent.latitude), lng: parseFloat(sportsEvent.longitude)},
                icon: customMarkerIcon3,
                map: globalMap,
                title: sportsEvent.name,
            })
        });

        //map.setCenter(map.getCenter())
        const string = `Here are some recommendations for you:\n\n
        Restaurants (Red Balloon):\n
        1. ${restaurants[0].name}, Hours: ${restaurants[0].hours}
        2. ${restaurants[1].name}, Hours: ${restaurants[1].hours}
        3. ${restaurants[2].name}, Hours: ${restaurants[2].hours}\n
        Musical Events (Purple Balloon):\n
        1. ${musicalEvents[0].name}, Hours: ${musicalEvents[0].hours}
        2. ${musicalEvents[1].name}, Hours: ${musicalEvents[1].hours}
        3. ${musicalEvents[2].name}, Hours: ${musicalEvents[2].hours}\n
        Sports Events (Blue Balloon):\n
        1. ${sportsEvents[0].name}, Hours: ${sportsEvents[0].hours}
        2. ${sportsEvents[1].name}, Hours: ${sportsEvents[1].hours}
        3. ${sportsEvents[2].name}, Hours: ${sportsEvents[2].hours}\n`

        return string

    }

    const handleClose = () => {
        setOpen(false);
        setMap(null);
        setResponse('');
    };

    const convertCelsiusToFahrenheit = (celsius) => {
        return (celsius * 9 / 5) + 32;
    };

    return (
        <>
            <Button variant="outlined" size="small" color="primary" onClick={handleClick}>
                Recommended For You
            </Button>
            <Modal open={open} onClose={handleClose} >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, height: 700, bgcolor: 'background.paper', boxShadow: 24, p: 4, overflow: 'auto' }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">Recommended For You</Typography>
                    {/* Google Maps div */}
                    <div
                        id="google-map"
                        style={{ width: '100%', height: '500px' }} // Adjust height as needed
                    ></div>
                    {/* Display current location and weather */}
                    <Typography variant="body1" gutterBottom>
                        Current Location: {currentLocation ? `${currentLocation.city}, ${currentLocation.country_name}` : 'Loading...'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Current Weather: {currentWeather ? `${convertCelsiusToFahrenheit(currentWeather.hourly.apparent_temperature[0])}°F` : 'Loading...'}
                    </Typography>
                    {/* Display response */}
                    <TextField
                        fullWidth
                        multiline
                        rows={10}
                        value={response ? response : "Loading Recommendation..."}
                        disabled
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                </Box>
            </Modal>
        </>
    );
};

export default RecommendationModal;

