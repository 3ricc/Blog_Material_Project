import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})


export async function getOpenAIResponse(prompt) {
    try {
        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Please generate a random reply to a post" }],
            model: "gpt-3.5-turbo",
            max_tokens: 100,
        });

        return response.choices[0]
    } catch (error) {
        console.error(error);
    }

}

async function getLocation() {
    const response = await fetch("https://ipapi.co/json/");
    const locationData = await response.json();
    return locationData;
}

async function getCurrentWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
    const response = await fetch(url);
    const weatherData = await response.json();
    return weatherData;
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
];

const availableTools = {
    getCurrentWeather,
    getLocation,
};

const messages = [
    {
        role: "system",
        content: `You are a helpful assistant. Only use the functions you have been provided with.`,
    },
];

export async function agent(userInput) {
    console.log(userInput)
    messages.push({
        role: "user",
        content: userInput,
    });

    for (let i = 0; i < 5; i++) {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: messages,
            tools: tools,
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



function Agent() {


    const [responseText, setResponseText] = useState("No response yet.")
    const handleClick = () => {
        agent("Please suggest 3 restaurants, 3 musical events and concerts, and 3 sports events based on my location and the weather.").then(response => {
            console.log(response)
            setResponseText(response)
        })
    }

    return (
        <ThemeProvider theme={createTheme()}>
            <Typography variant="h3" gutterBottom>AGENT PAGE</Typography>
            <Button onClick={handleClick}>Click here for Recommendations Based on your Location</Button>
            {responseText.split('\n').map((line, index) => (
                <Typography key={index} variant='body1'>{line}</Typography>
            ))}
        </ThemeProvider>
    )

}
export default Agent;