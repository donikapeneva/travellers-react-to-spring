import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CopyrightComponent } from '../shared/copyright-component';
import { HomeHeader } from '../shared/home-header';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { tripService } from '../../services/trip-service';
import { imageService } from '../../services/image-service';
import { ExternalsPlugin } from 'webpack';
import { ITrip } from '../../data/i-trip';
import { IImage } from '../../data/i-image';
import { routingHistory } from '../../history';
import { ImageGridList } from '../images/images-component';
import { UploadImageComponent } from '../images/upload-image-component';
import { ICity } from '../../data/i-city';
import {ICountry} from "../../data/i-country";
import { placeService } from '../../services/place-service';
import {IStateImage} from "./trip-card-component";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/1600x900/?city)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textSpace: {
    margin: theme.spacing(5),
  },
  smallTextSpace: {
    margin: theme.spacing(2),
  },
  textArea: {
    margin: theme.spacing(2),
    width: 500,
    height: 300,
  }
}));

const createTrip = async (trip: Partial<ITrip>): Promise<void> => {


    routingHistory.push('/trips');
    const tripId = await tripService.createTrip(trip);
    console.log("NEW TRIP : " + tripId);

   // routingHistory.push('/trips');
};


export type IPlace = {
  countries : ICountry[],
  cities : ICity[]
}

//todo cities are alreagy loaded in trip component!

export const CreateTripComponent = (props: ICreateTripComponentProps) => {
  const classes = useStyles();

  const initialTrip: Partial<ITrip> = {
    name: undefined,
    userId: 1,
    cityId: undefined,
    time: undefined,
    tip: undefined,
  };


  const initialPlaces: IPlace =
  {
    countries : [{
      id: undefined,
      name: undefined,
      countryCode: undefined,
    }],
    cities : [{
      id: undefined,
      name: undefined,
      countryId: undefined,
      country: undefined,
    }]

  };


  const [trip, setTrip] = React.useState(initialTrip);
  const [places, setPlaces] = React.useState(initialPlaces);
  React.useEffect(
      () => {
        async function getPlaces() {
          const countries = await placeService.getAllCountries();
          const cities = await placeService.getAllCities();
          console.log("oh pleeeeeeeeeeeeeease");
          console.log(countries);
          const loadedPlaces = {cities, countries} ;
          loadedPlaces.cities = cities;
          loadedPlaces.countries = countries;
          setPlaces({
            countries : loadedPlaces.countries,
            cities: loadedPlaces.cities
          });
        }

        getPlaces();
      },
      []
  )


  return (
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h6" className={classes.textSpace}>
          Your Adventure
        </Typography>
        <form className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="trip-name"
            label="Trip name"
            name="tripname"
            onChange={(event) => {
              const newName = event.target.value;

              setTrip({ ...trip, name: newName });
            }}
          />
          {/* TODO use props.cities */}
          <Autocomplete
              className={classes.smallTextSpace}
            id="combo-box-demo"
            options={places.cities}
            getOptionLabel={(option) => {
              return option.name;
            }}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="City" variant="outlined" />
            )}
            onChange={(event: object, value: any, reason: string) => {
              console.log(value);


              setTrip({ ...trip, cityId: value.id });
            }}
          />

          <TextField
              className={classes.smallTextSpace}
            id="date"
            label="Date"
            type="date"
            defaultValue="2017-05-24"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              const date = event.target.value;

              setTrip({ ...trip, time: date });
            }}
          />

          <TextareaAutosize
              className={classes.textArea}
              aria-label="empty textarea"
              placeholder="Tip"
              onChange={(event) => {
                const tip = event.target.value;

                setTrip({ ...trip, tip: tip });
              }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={async () => {
              await createTrip(trip);
            }}
          >
            Create
          </Button>
        </form>
      </div>
    </Grid>
  );
};

export interface ICreateTripComponentProps {
  cities: ICity[];
}
