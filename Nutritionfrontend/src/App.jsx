import { useState } from "react";
import axios from "axios";

export default function CalorieCalculator() {
  const [formData, setFormData] = useState({
    age: "",
    sex: "male",
    weight: "",
    height: "",
    activity: "moderate",
    goal: "maintain",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/calculate", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Calorie Calculator</h1>
      <form className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md" onSubmit={handleSubmit}>
        {/* Form inputs remain the same */}
        <div className="grid gap-4">
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.age}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.weight}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.height}
            onChange={handleChange}
            required
          />
          <select
            name="sex"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.sex}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            name="activity"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.activity}
            onChange={handleChange}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
          <select
            name="goal"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.goal}
            onChange={handleChange}
          >
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Gain Weight</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          Calculate
        </button>
      </form>

      {loading && <p className="text-lg">Loading...</p>}

      {result && (
        <div className="mt-4 p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl">
          <p className="text-lg mb-4">Daily Calories: <strong>{result.calories}</strong></p>
          {result.meals && result.meals.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-3">Suggested Meals:</h2>
              <div className="grid gap-4">
                {result.meals.map((meal) => (
                  <div key={meal.id} className="border border-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold">{meal.title}</h3>
                    <p>Ready in: {meal.readyInMinutes} minutes</p>
                    <p>Servings: {meal.servings}</p>
                    <a
                      href={meal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View Recipe
                    </a>
                    {meal.image && (
                      <img
                        src={`https://spoonacular.com/recipeImages/${meal.image}`}
                        alt={meal.title}
                        className="mt-2 w-full max-w-xs rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No meal suggestions available.</p>
          )}
        </div>
      )}
    </div>
  );
}