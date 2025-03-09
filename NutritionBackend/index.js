const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

// Verify API key at startup
const API_KEY = process.env.SPOONACULAR_API_KEY;
if (!API_KEY) {
  console.error("SPOONACULAR_API_KEY not found in environment variables");
}

app.get("/", (req, res) => {
  res.send("Calorie Calculation API is running");
});

app.post("/api/calculate", async (req, res) => {
  const { age, sex, weight, height, activity, goal } = req.body;

  if (!age || !sex || !weight || !height || !activity || !goal) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  // BMR Calculation
  const bmr =
    sex === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const goalMultiplier = { lose: 0.8, maintain: 1.0, gain: 1.2 };
  const tdee = bmr * (activityMultiplier[activity] || 1.55);
  const dailyCalories = Math.round(tdee * (goalMultiplier[goal] || 1.0));

  if (!API_KEY) {
    return res.status(500).json({
      message: "Server configuration error: API key not found",
      calories: dailyCalories,
      meals: []
    });
  }

  try {
    const apiUrl = `https://api.spoonacular.com/mealplanner/generate?targetCalories=${dailyCalories}&timeFrame=day&apiKey=${API_KEY}`;
    
    console.log("Requesting:", apiUrl);
    
    const response = await axios.get(apiUrl);
    
    console.log("Raw API response:", JSON.stringify(response.data, null, 2));

    res.status(200).json({
      message: "Calories calculated successfully",
      calories: dailyCalories,
      meals: response.data.meals || response.data || [], // Fallback to full response if meals not found
    });
  } catch (error) {
    console.error("Error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    res.status(500).json({
      message: "Calories calculated, but meal suggestion unavailable",
      calories: dailyCalories,
      meals: [],
      error: error.response?.data?.message || error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));