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
import { makeStyles } from '@material-ui/core/styles';
import { CopyrightComponent } from '../shared/copyright-component';
import { HomeHeader } from '../shared/home-header';
import { imageService } from '../../services/image-service';
import { IImage } from '../../data/i-image';
import { routingHistory } from '../../history';
import { ImageGridList } from '../images/images-component';
import { UploadImageComponent } from '../images/upload-image-component';
import { CreateTripComponent } from '../trips/create-trip-component';
import { ViewTripComponent } from '../trips/view-trip-component';
import { tripService } from '../../services/trip-service';
import { ModifyTripComponent } from '../../components/trips/modify-trip-component';
import { placeService } from '../../services/place-service';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  images: {
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
}));

export const TripComponent = () => {
  const classes = useStyles();
  const locationHistoryState: any = routingHistory.location.state;
  const tripId =
    locationHistoryState && locationHistoryState.tripId !== undefined
      ? locationHistoryState.tripId
      : undefined;

  const modifyTrip =
    locationHistoryState && locationHistoryState.modify !== undefined
      ? locationHistoryState.modify
      : false;

  const initialImages: IStateImages = {
    images: [],
  };

  const [tripImages, setImages] = React.useState(initialImages);
  const [trip, setTrip] = React.useState(undefined);
  const [cities, setCities] = React.useState(undefined);
  const [places, setPlaces] = React.useState(undefined);

  // React.useEffect(
  //     () => {
  //       async function getPlaces() {
  //         const countries = await placeService.getAllCountries();
  //         const cities = await placeService.getAllCities();
  //         const loadedPlaces = {cities, countries} ;
  //         loadedPlaces.cities = cities;
  //         loadedPlaces.countries = countries;
  //         setPlaces({
  //           countries :loadedPlaces.countries,
  //           cities: loadedPlaces.cities
  //         });
  //       }
  //
  //       getPlaces();
  //     },
  //     []
  // )

  // component did mount
  React.useEffect(() => {
    async function getTrip() {
      if(!tripId) {
        return;
      }

      const trip = await tripService.getTrip(tripId);
      setTrip(trip);
    }

    getTrip();

    async function getImages() {
      if(!tripId) {
        return;
      }

      const images = await imageService.getByTripId(tripId);
      setImages({ images });
    }

    getImages();

    async function getCities() {
      const cities = await placeService.getAllCities();
      setCities({ cities });
    }

    getCities();

  }, []);


  async function getPlaces() {
    const countries = await placeService.getAllCountries();
    const cities = await placeService.getAllCities();
    const loadedPlaces = {cities, countries} ;
    loadedPlaces.cities = cities;
    loadedPlaces.countries = countries;
    setPlaces({
      countries :loadedPlaces.countries,
      cities: loadedPlaces.cities
    });
  }

  getPlaces();



  const currentTripComponent: JSX.Element = tripId != undefined ? (
    modifyTrip ? (
      <ModifyTripComponent trip={trip} cities={places.cities} />
    ) : (
      <ViewTripComponent trip={trip} />
    )
  ) : (
    <CreateTripComponent cities={cities} />
  );



  const uploadImageHandler = async (imagesData: Iterable<File>) => {
    const newImageId = await imageService.upload(imagesData, tripId);

    const newImage = await imageService.getById(newImageId);

    setImages({ images: [...tripImages.images, newImage] });
  };

  const removeImageHandler = async (imageId: string) => {
    await imageService.delete(imageId);
    const images = tripImages.images.filter((image) => {
      image.id! !== Number(imageId);
    });
    setImages({ images: images });
  };

  const imagesComponent: JSX.Element =
    tripImages.images.length > 0 ? (
      <Grid item xs={false} sm={4} md={7} className={classes.images}>
        <ImageGridList
          images={tripImages.images}
          onRemoveImage={removeImageHandler}
        ></ImageGridList>
      </Grid>
    ) : (
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
    );

  return (
    <div>
      <HomeHeader fixedPosition={true} />
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        {imagesComponent}
        {currentTripComponent}
        {tripId && <UploadImageComponent onUpload={uploadImageHandler} />}
      </Grid>
    </div>
  );
};

export interface IStateImages {
  images: IImage[];
}

