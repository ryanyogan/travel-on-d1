import { Check, ChevronsUpDown } from "lucide-react";
import { Fragment, useState } from "react";
import { Header } from "~/components/header";
import * as schema from "~/database/schema";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { data, Form, redirect, useNavigation } from "react-router";
import { ClientOnly } from "remix-utils/client-only";
import { MapClient } from "~/components/map.client";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { comboBoxItems, selectItems } from "~/constants";
import { world_map } from "~/constants/world_map";
import { cn, formatKey, parseMarkdownToJson } from "~/lib/utils";
import type { Route } from "./+types/create-trip";

export async function action({ request, context }: Route.ActionArgs) {
  const form = await request.formData();
  const formData = Object.fromEntries(form.entries());

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
      .map((result: any) => result.urls?.regular || null)
      .join(", ");

    const [result] = await context.db
      .insert(schema.trip)
      .values({
        tripDetails: JSON.stringify(trip),
        imageUrls,
        userId: user.user.id,
      })
      .returning();

    return redirect(`/trips/${result.id}`);
  } catch (error) {
    console.error("Error creating trip", error);
    return data({
      error: "An error occurred while creating the trip. Please try again.",
    });
  }
}

export async function loader() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = (await response.json()) as any;

  return data.map((country: any) => ({
    name: country.flag + " " + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreeMap,
  }));
}

export default function CreateTrip({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const countries = loaderData as Country[];
  const [country, setCountry] = useState("");
  const [dropdownStates, setDropdownStates] = useState<
    Record<Country["name"], string>
  >({});
  const navigation = useNavigation();

  const mapData = {
    country,
    color: "#EA382E",
    coordinates:
      world_map.features.find((feature) => feature.properties.name === country)
        ?.geometry.coordinates || [],
  };

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip"
        description="View and edit Ai Generated travel plans"
      />

      <section className="mt-2.5 wrapper-md">
        <Form method="POST" className="trip-form p-4">
          <input type="hidden" name="country" value={country} />
          <Label>Country</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {value
                  ? countries.find((country) => country.value === value)?.name
                  : "Select a Country..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Seach Countries..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.name}
                        value={country.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setCountry(currentValue);
                          setOpen(false);
                        }}
                      >
                        {country.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === country.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Label>Country</Label>
          <Input
            type="number"
            placeholder="Enter a number of days"
            name="duration"
          />

          {selectItems.map((item) => {
            return (
              <Fragment key={item}>
                <input type="hidden" name={item} value={dropdownStates[item]} />
                <Label>{formatKey(item)}</Label>
                <Select
                  onValueChange={(value) =>
                    setDropdownStates((prev) => ({
                      ...prev,
                      [item]: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select a ${formatKey(item)}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {comboBoxItems[item].map((cb) => (
                      <SelectItem key={cb} value={cb}>
                        {cb}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Fragment>
            );
          })}

          <div className="rounded-md">
            <Label>Map</Label>
            <ClientOnly fallback={<div>Loading...</div>}>
              {() => <MapClient mapData={mapData} />}
            </ClientOnly>
          </div>

          <div className="bg-gray-200 h-px w-full" />

          <div className="px-6 w-full">
            <Button
              disabled={navigation.state === "submitting"}
              type="submit"
              className="h-12 w-full cursor-pointer"
            >
              <img
                className={cn(
                  "size-5",
                  navigation.state === "submitting" && "animate-spin"
                )}
                src={`/assets/icons/${
                  navigation.state !== "idle" ? "loader.svg" : "magic-star.svg"
                }`}
              />
              <span className="p-16-semibold text-white">
                {navigation.state === "submitting"
                  ? "Creating..."
                  : "Create Trip"}
              </span>
            </Button>
          </div>
        </Form>
      </section>
    </main>
  );
}
