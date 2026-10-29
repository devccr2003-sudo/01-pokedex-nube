import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // constructor(private readonly axios: HttpService) {}
  // private readonly axios: AxiosInstance = axios;
  constructor(
    private readonly http: AxiosAdapter,
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  // async executeSeed() {
  //   const { data } = await this.axios.get(
  //     'https://pokeapi.co/api/v2/pokemon?limit=600',
  //   );
  //   return data;
  // }
  
  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // delete * from pokemons

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=150',
    );

    // const insertPromisesArray = [];

    // data.results.forEach(async ({ name, url }) => {
    //   const segments = url.split('/');
    //   const no: number = +segments[segments.length - 2];

    //   insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    // });

    // await Promise.all(insertPromisesArray);

    const pokemonToInsert: CreatePokemonDto[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Execute';
  }
}
