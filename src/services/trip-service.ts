import Axios from 'axios';
import { ITrip } from '../data/i-trip';
import { BACKEND_URL } from '../config';
import {debuglog} from "util";

class TripService implements ITripService {
  public async getTrip(tripId: string): Promise<ITrip> {
      const tripResponse = await Axios.get(`${BACKEND_URL}/adventures/${tripId}`);

      return tripResponse.data;


  }

  public async getTrips(): Promise<ITrip[]> {
     const tripsResponse = await Axios.get(`${BACKEND_URL}/adventures`);

     return tripsResponse.data;


  }

  public async createTrip(trip: Partial<ITrip>): Promise<string> {
    console.log(">>> ");
    console.log(trip);

    const result = await Axios.post(`${BACKEND_URL}/adventures`,  trip );

    console.log("RESULT : " + result.data);

    // return result.data;
    return null;
  }

  public async updateTrip(tripId: string, trip: Partial<ITrip>): Promise<void> {
    await Axios.put(`${BACKEND_URL}/adventures/${tripId}`,  trip );
  }

  public async deleteTrip(tripId: string): Promise<void> {
    await Axios.delete(`${BACKEND_URL}/adventures/${tripId}`);
  }
}

export interface ITripService {
  getTrip(tripId: string): Promise<ITrip>;
  getTrips(): Promise<ITrip[]>;
  createTrip(trip: Partial<ITrip>): Promise<string>;
  updateTrip(tripId: string, trip: Partial<ITrip>): Promise<void>;
  deleteTrip(tripId: string): Promise<void>;
}

export const tripService = new TripService();
