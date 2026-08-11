export enum RoadmapBoard
{
  StarCitizen = 'starcitizen',
  Squadron42 = 'squadron42'
}

export interface RSIRoadmapCard
{
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name?: string;
}

export interface RSIRoadmapRelease
{
  id: number;
  name: string;
  description: string;
  cards: RSIRoadmapCard[];
}

export interface RSIRoadmapCategory
{
  id: number;
  name: string;
}