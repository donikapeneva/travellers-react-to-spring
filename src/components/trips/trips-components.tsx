import * as React from 'react';

import { ITrip } from '../../data/i-trip';
import { tripService } from '../../services/trip-service';
import { TripComponent } from './trip-card-component';
import { Grid } from '@material-ui/core/';
import { HomeHeader } from '../shared/home-header';
import { CreateTripButton } from '../trips/create-trip-button';
import { routingHistory } from '../../history';
import {HeaderComponent} from "../shared/header";
import {placeService} from "../../services/place-service";

export class TripsComponent extends React.Component<{}, ITripsComponentState> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      trips: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    const trips = await tripService.getTrips();

    this.setState({ trips });
  }

  public render() {
    return (
      <div>
          <HeaderComponent title={'Explore'} />
        <HomeHeader />
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {this.state.trips &&
            this.state.trips.map((trip: ITrip, index: number) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <TripComponent trip={trip} />
              </Grid>
            ))}
        </Grid>
        <CreateTripButton
              onClick={() => {
                routingHistory.push('/trip');
              }}
        />
      </div>
    );
  }
}

export interface ITripsComponentState {
  trips: ITrip[];
}
