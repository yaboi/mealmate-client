import * as React from 'react';
import { gql, useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Header from './components/Header';
import SearchInput from './components/SearchInput';

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  description: string;
}

/**
 * TODO:
 * - Implement defer when available from mutation to
 *   potentially improve perceived peformance
 * see: https://www.apollographql.com/docs/react/data/defer/
 */
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
  const [preferences, setPreferences] = React.useState<string[]>([]);

  const [generateRecipes, { loading, data }] = useMutation(GENERATE_RECIPES);

  function onSearchInputSubmit(ingredients: string[]) {
    generateRecipes({
      variables: {
        input: {
          ingredients,
          preferences,
        },
      },
    });
  }

  /**
   * TODO:
   * - Improve the loading state to use things like MUI Loading Button, Progress Indicators, and/or Skeletons
   *  see:
   *    - Progress: https://mui.com/material-ui/react-progress/
   *    - Skeleton: https://mui.com/material-ui/react-skeleton/
   * - Improve empty state for when no receipes were generated, provide suggestions
   *   on ways to improve the changes of a recipe being generated.
   */
  return (
    <>
      <Container>
        <Header />
        <Container maxWidth="md" sx={{ mt: { xs: 5, md: 10 } }}>
          <Typography align="center" variant="h3" component="h1" gutterBottom>
            Ingredient Inspired Recipes
          </Typography>
          <Typography align="center" variant="h5" component="h2">
            Simply add ingredients and MealMate&apos;s AI will generate recipes just for you.
          </Typography>
          <SearchInput loading={loading} minIngredients={3} onSubmit={onSearchInputSubmit} />
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <FormControl>
              <FormLabel>
                <Typography variant="caption" display="block" sx={{ pr: 1 }}>
                  Dietary Preferences:
                </Typography>
              </FormLabel>
              <FormGroup row>
                {['Vegan', 'Vegetarian', 'Gluten Free', 'Dairy Free', 'Nut Free'].map(
                  (preference, index) => {
                    return (
                      <FormControlLabel
                        key={`${index}-${preference}`}
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
                  },
                )}
              </FormGroup>
            </FormControl>
          </Box>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {data?.generateRecipes?.edges?.map(({ node: recipe }: { node: Recipe }) => (
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
            ))}
          </Grid>
        </Container>
      </Container>
    </>
  );
};

export default App;
