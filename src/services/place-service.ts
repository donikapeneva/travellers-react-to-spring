import Axios from 'axios';
import { BACKEND_URL } from '../config';
import { ICity } from '../data/i-city';
import {ICountry} from "../data/i-country";

class PlaceService implements ICityService, ICountryService {
  public async getAllCities(): Promise<ICity[]> {
    const citiesResponse = await Axios.get(`${BACKEND_URL}/cities`);

    return citiesResponse.data;
  }

  public async getAllCountries(): Promise<ICountry[]> {
    const countiesResponse = await Axios.get(`${BACKEND_URL}/countries`);

    return countiesResponse.data;
  }

  public async getCitiesByCountryId(countryId: string): Promise<ICity[]> {
    const citiesResponse = await Axios.get(`${BACKEND_URL}/countries/${countryId}/cities`);

    return citiesResponse.data;
  }
}

export interface ICityService {
  getAllCities(): Promise<ICity[]>;
}

export interface ICountryService {
  getAllCountries(): Promise<ICountry[]>;
}

export const placeService = new PlaceService();
