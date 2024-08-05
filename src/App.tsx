import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  description: string;
}

// Define the GraphQL mutation
const GENERATE_RECIPES = gql`
  mutation GenerateRecipes($input: RecipeGenerationInput!) {
    generateRecipes(input: $input) {
      edges {
        node {
          id
          title
          description
          ingredients
          instructions
        }
      }
    }
  }
`;

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [generateRecipes, { loading, data }] = useMutation(GENERATE_RECIPES);

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "" && !ingredients.includes(newIngredient)) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(
      ingredients.filter((i) => {
        return i !== ingredient;
      })
    );
  };

  const handleGenerateRecipes = async () => {
    try {
      /**
       * TODO:
       * Add validation that ensures the user has put in more than two ingredients
       */
      /**
       * TODO:
       * Adjust this auto-generated pattern to destructure loading, data,
       * and error from useMutation hook instead of using additional react state
       */
      console.log({
        variables: {
          input: {
            ingredients,
            preferences,
          },
        },
      });
      generateRecipes({
        variables: {
          input: {
            ingredients,
            preferences,
          },
        },
      });
    } catch (error) {
      console.error("Error generating recipes:", error);
    }
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Recipe Generator</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <TextField
          label="Add Ingredient"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddIngredient();
            }
          }}
          disabled={loading}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={handleAddIngredient}
        >
          Add Ingredient
        </Button>
        <div style={{ marginTop: "16px" }}>
          {ingredients.map((ingredient) => (
            <Chip
              key={ingredient}
              label={ingredient}
              onDelete={() => handleRemoveIngredient(ingredient)}
              style={{ margin: "4px" }}
            />
          ))}
        </div>
        <FormGroup>
          <FormControlLabel
            disabled={loading}
            control={
              <Checkbox
                onChange={(e) =>
                  setPreferences((prev) =>
                    e.target.checked
                      ? [...prev, "Vegan"]
                      : prev.filter((p) => p !== "Vegan")
                  )
                }
              />
            }
            label="Vegan"
          />
          <FormControlLabel
            disabled={loading}
            control={
              <Checkbox
                onChange={(e) =>
                  setPreferences((prev) =>
                    e.target.checked
                      ? [...prev, "Vegetarian"]
                      : prev.filter((p) => p !== "Vegetarian")
                  )
                }
              />
            }
            label="Vegetarian"
          />
          <FormControlLabel
            disabled={loading}
            control={
              <Checkbox
                onChange={(e) =>
                  setPreferences((prev) =>
                    e.target.checked
                      ? [...prev, "Gluten Free"]
                      : prev.filter((p) => p !== "Gluten Free")
                  )
                }
              />
            }
            label="Gluten Free"
          />
          <FormControlLabel
            disabled={loading}
            control={
              <Checkbox
                onChange={(e) =>
                  setPreferences((prev) =>
                    e.target.checked
                      ? [...prev, "Celiac"]
                      : prev.filter((p) => p !== "Celiac")
                  )
                }
              />
            }
            label="Celiac"
          />
        </FormGroup>
        <Button
          disabled={loading}
          variant="contained"
          color="primary"
          onClick={handleGenerateRecipes}
          style={{ marginTop: "16px" }}
        >
          Generate Recipes
        </Button>
        <Grid container spacing={2} style={{ marginTop: "16px" }}>
          {data?.generateRecipes?.edges?.map(
            ({ node: recipe }: { node: Recipe }) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {recipe.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {recipe.description}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Ingredients: {recipe.ingredients.join(", ")}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Instructions: {recipe.instructions.join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Container>
    </Container>
  );
};

export default App;
