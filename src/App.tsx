import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Header from "./components/Header";

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
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [generateRecipes, { loading, data }] = useMutation(GENERATE_RECIPES);

  function handleGenerateRecipes() {
    if (ingredients.length < 3) {
      setShowDialog(true);
      return;
    }

    generateRecipes({
      variables: {
        input: {
          ingredients,
          preferences,
        },
      },
    });
  }

  return (
    <>
      <Container>
        <Header />
        <Container maxWidth="md" sx={{ mt: 6 }}>
          <Typography align="center" variant="h3" component="h1" gutterBottom>
            Ingredient Inspired Recipes
          </Typography>
          <Typography align="center" variant="h5" component="h2">
            Simply add ingredients and MealMate's AI will generate recipes just
            for you.
          </Typography>
          <Box
            sx={{
              display: "flex",
              mt: 4,
            }}
          >
            <Autocomplete
              multiple
              fullWidth
              freeSolo
              options={[]}
              disabled={loading}
              value={ingredients}
              onChange={(event, newValue) => {
                setIngredients(newValue);
              }}
              renderTags={(value: string[], getTagProps) => {
                return value.map((option: string, index: number) => {
                  return <Chip label={option} {...getTagProps({ index })} />;
                });
              }}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Add Ingredient"
                    placeholder="Type an ingredient and press Enter"
                  />
                );
              }}
            />
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGenerateRecipes}
              sx={{ ml: 1, width: "35%" }}
            >
              Generate Recipes
            </Button>
          </Box>
          <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <FormControl>
              <FormLabel>
                <Typography variant="caption" display="block" sx={{ pr: 1 }}>
                  Dietary Preferences:
                </Typography>
              </FormLabel>
              <FormGroup row>
                {[
                  "Vegan",
                  "Vegetarian",
                  "Gluten Free",
                  "Dairy Free",
                  "Nut Free",
                ].map((preference) => {
                  return (
                    <FormControlLabel
                      disabled={loading}
                      control={
                        <Checkbox
                          onChange={(e) =>
                            setPreferences((prev) => {
                              if (e.target.checked) {
                                return [...prev, preference];
                              }

                              return prev.filter((selectedPreference) => {
                                return selectedPreference !== preference;
                              });
                            })
                          }
                        />
                      }
                      label={preference}
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {data?.generateRecipes?.edges?.map(
              ({ node: recipe }: { node: Recipe }) => (
                <Grid item xs={12} sm={6} md={12} key={recipe.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" gutterBottom>
                        {recipe.title}
                      </Typography>
                      <Typography variant="subtitle1" paragraph>
                        {recipe.description}
                      </Typography>
                      <Typography variant="h5">Ingredients:</Typography>
                      <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index}>
                            <Typography>{ingredient}</Typography>
                          </li>
                        ))}
                      </ul>
                      <Typography variant="h5" paragraph>
                        Instructions:
                      </Typography>
                      <ol>
                        {recipe.instructions.map((instruction, index) => (
                          <li key={index}>
                            <Typography paragraph>{instruction}</Typography>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </Grid>
              )
            )}
          </Grid>
        </Container>
      </Container>
      {showDialog ? (
        <Dialog
          maxWidth="sm"
          open
          keepMounted
          onClose={(e) => {
            setShowDialog(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Get the most from MealMate's AI
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography paragraph>
                Please add at least 3 ingredients. If you're having trouble
                coming up with ingredients, try adding ingredients you already
                have in your kitchen.
              </Typography>
            </DialogContentText>
            <DialogActions>
              <Button
                variant="outlined"
                onClick={(e) => {
                  setShowDialog(false);
                }}
              >
                Close
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default App;
