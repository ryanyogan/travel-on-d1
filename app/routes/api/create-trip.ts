import { GoogleGenerativeAI } from "@google/generative-ai";
import { data } from "react-router";
import z from "zod";
import * as schema from "~/database/schema";
import { parseMarkdownToJson } from "~/lib/utils";
import type { Route } from "./+types/create-trip";

const formSchema = z.object({
  country: z.string(),
  duration: z.string(),
  travelStyle: z.string(),
  budget: z.string(),
  interest: z.string(),
  groupType: z.string(),
});

export async function action({ request, context }: Route.ActionArgs) {
  const rawJson = await request.json();
  const formData = formSchema.parse(rawJson);
  const user = await context.auth.api.getSession(request);
  if (!user) {
    return { error: "You must be logged in to create a trip" };
  }

  const genAI = new GoogleGenerativeAI(context.cloudflare.env.GEMINI_API_KEY);

  try {
    const prompt = `Generate a ${formData.duration}-day travel itinerary for ${formData.country} based on the following user information:
        Budget: '${formData.budget}'
        Interests: '${formData.interest}'
        TravelStyle: '${formData.travelStyle}'
        GroupType: '${formData.groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${formData.duration},
        "budget": "${formData.budget}",
        "travelStyle": "${formData.travelStyle}",
        "country": "${formData.country}",
        "interests": ${formData.interest},
        "groupType": "${formData.groupType}",
        "bestTimeToVisit": [
          '🌸 Season (from month to month): reason to visit',
          '☀️ Season (from month to month): reason to visit',
          '🍁 Season (from month to month): reason to visit',
          '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
          '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
          '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
          "city": "name of the city or region",
          "coordinates": [latitude, longitude],
          "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
          "day": 1,
          "location": "City/Region Name",
          "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
          ]
        },
        ...
        ]
    }`;

    const textResult = await genAI
      .getGenerativeModel({ model: "gemini-2.0-flash" })
      .generateContent([prompt]);

    const trip = parseMarkdownToJson(textResult.response.text());

    const imageResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${formData.country} ${formData.interest} ${formData.travelStyle}&client_id=${context.cloudflare.env.UNSPLASH_ACCESS_KEY}`
    );

    const imageUrls = ((await imageResponse.json()) as any).results
      .slice(0, 3)
      .map((result: any) => result.urls?.regular || null);

    const [result] = await context.db
      .insert(schema.trip)
      .values({
        tripDetails: JSON.stringify(trip),
        imageUrls,
        userId: user.user.id,
      })
      .returning();

    return data({ id: result.id });
  } catch (error) {
    console.error("Error creating trip", error);
  }
}
