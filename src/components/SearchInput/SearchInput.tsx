import React, { useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import LoadingButton from "@mui/lab/LoadingButton";

import CloseIcon from "@mui/icons-material/Close";
import RamenDiningTwoToneIcon from "@mui/icons-material/RamenDiningTwoTone";

interface Props {
  loading: boolean;
  onSubmit: (ingredients: string[]) => any;
  minIngredients?: number;
}

function SearchInput(props: Props) {
  const { loading, minIngredients = 0, onSubmit: onSubmitProp } = props;

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);

  function handleSubmit() {
    if (ingredients.length < minIngredients) {
      setShowDialog(true);
      return;
    }

    if (onSubmitProp) {
      onSubmitProp(ingredients);
    }
  }

  return (
    <>
      <Grid
        container
        spacing={{ xs: 1, md: 0.5 }}
        sx={{ pt: { xs: 4, md: 8 } }}
      >
        <Grid item xs={12} md={8}>
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
                return (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={index}
                  />
                );
              });
            }}
            inputValue={inputValue}
            onInputChange={(event, newValue) => {
              /**
               * If newValue ends with a comma and space, we can assume
               * intent from the user to add the ingredient to the
               * ingredients "list" (Tags/Chips)
               */
              if (newValue.slice(-2) === ", ") {
                setIngredients([...ingredients, newValue.trim().slice(0, -1)]);
                setInputValue("");
                return;
              }

              setInputValue(newValue);
            }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  autoFocus
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  label="Add Ingredient"
                  placeholder={
                    loading ? "" : "Type an ingredient and press Enter"
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && inputValue.length === 0) {
                      handleSubmit();
                    }
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LoadingButton
            fullWidth
            loading={loading}
            loadingPosition="start"
            startIcon={<RamenDiningTwoToneIcon />}
            variant="contained"
            color="primary"
            size="large"
            sx={{ height: "100%" }}
            onClick={() => {
              handleSubmit();
            }}
          >
            <span>{`Generat${loading ? "ing" : "e"} Recipes`}</span>
          </LoadingButton>
        </Grid>
      </Grid>
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
          {/*
            TODO:
            At the very least abstract the DialogTitle construct
            to a custom component so that it can be the default
            throughout the site/app to include a "close" IconButton
           */}
          <DialogTitle id="alert-dialog-title">
            Get the most from MealMate's AI
            <IconButton
              size="small"
              aria-label="Close"
              onClick={() => {
                setShowDialog(false);
              }}
              sx={{ position: "absolute", right: "14px", top: "14px" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" paragraph>
              {`Please add at least ${minIngredients} ingredients. If you're
                having trouble coming up with ingredients, try adding
                ingredients you already have in your kitchen.`}
            </DialogContentText>
            <DialogActions>
              <Button
                variant="outlined"
                tabIndex={1}
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
}

export default SearchInput;
