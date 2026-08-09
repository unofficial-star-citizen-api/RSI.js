
/** @internal */
export interface RSIStarmapCelestialObject
{
  success: number;
  code: string;
  msg: string;
  data: RSIStarmapCelestialObjectData;
}

/** @internal */
export interface RSIStarmapCelestialObjectData
{
  rowcount: number;
  pagecount: null;
  startrow: number;
  resultset: RSIStarmapCelestialObjectResultset[];
  totalrows: number;
  pagesize: number;
  page: number;
  offset: number;
  estimatedrows: boolean;
}

export interface RSIStarmapCelestialObjectResultset
{
  id: number;
  age: number | null;
  appearance: string;
  axial_tilt: number | null;
  code: string;
  description: null | string;
  designation: string;
  distance: number;
  fairchanceact: boolean | null;
  habitable: boolean | null;
  info_url: null | string;
  latitude: number;
  longitude: number;
  name: null | string;
  orbit_period: number | null;
  parent_id: number | null;
  sensor_danger: string;
  sensor_economy: string;
  sensor_population: string;
  shader_data: RSIStarmapCelestialObjectResultsetShaderData | null;
  show_label: boolean | null;
  show_orbitlines: boolean | null;
  size: number;
  subtype_id: number | null;
  time_modified: string;
  type: string;
  subtype: RSIStarmapCelestialObjectSubtype | null;
  affiliation: unknown[];
  population: unknown[];
  children: RSIStarmapCelestialObjectChild[];
}

export interface RSIStarmapCelestialObjectChild
{
  id: number;
  age: number | null;
  appearance: string;
  axial_tilt: number | null;
  code: string;
  description: null | string;
  designation: string;
  distance: number | null;
  fairchanceact: boolean | null;
  habitable: boolean | null;
  info_url: null | string;
  latitude: number | null;
  longitude: number | null;
  name: null | string;
  orbit_period: number | null;
  parent_id: number;
  sensor_danger: string;
  sensor_economy: string;
  sensor_population: string;
  shader_data: RSIStarmapCelestialObjectChildShaderData | null;
  show_label: boolean | null;
  show_orbitlines: boolean | null;
  size: number | null;
  subtype_id: number;
  time_modified: string;
  type: string;
  subtype: RSIStarmapCelestialObjectSubtype;
  affiliation: RSIStarmapCelestialObjectAffiliation[];
  population: unknown[];
  media: RSIStarmapCelestialObjectMedia[];
}

export interface RSIStarmapCelestialObjectAffiliation
{
  id: number;
  code: string;
  color: string;
  name: string;
  'membership.id': number;
}

export interface RSIStarmapCelestialObjectMedia
{
  id: number;
  cover_data: null;
  depot: string;
  depot_status: string;
  derived_data: RSIStarmapCelestialObjectDerivedData;
  distant_id: null;
  distant_source: null;
  publish_end: null;
  publish_start: null;
  purpose: string;
  slug: string;
  source_duration: null;
  source_extension: string;
  source_name: string;
  status: string;
  tag_string: string;
  time_modified: string;
  type: string;
  source_url: string;
  source_stream: RSIStarmapCelestialObjectSourceStream;
  images: RSIStarmapCelestialObjectImages;
  'membership.id': number;
  'membership.slot': string;
}

export interface RSIStarmapCelestialObjectDerivedData
{
  sizes: { [key: string]: RSIStarmapCelestialObjectSize; };
}

export interface RSIStarmapCelestialObjectSize
{
  width: number;
  height: number | null | string;
  mode: RSIStarmapCelestialObjectMode;
  delete?: RSIStarmapCelestialObjectDelete;
}

export enum RSIStarmapCelestialObjectDelete
{
  The11 = '1--1',
}

export enum RSIStarmapCelestialObjectMode
{
  Resize = 'resize',
  ResizeCrop = 'resize-crop',
}

export interface RSIStarmapCelestialObjectImages
{
  heap_note: string;
  heap_thumb: string;
  heap_infobox: string;
  post_section_header: string;
  channel_item_full: string;
  home_transmissions_item_expanded: string;
  subscribers_vault_thumbnail: string;
  slideshow: string;
  slideshow_pager: string;
  slideshow_wide: string;
  vault_thumb: string;
  post: string;
  wallpaper_thumb: string;
  product_thumb_large: string;
  product_thumb_medium_and_small: string;
  component_description: string;
  product_thumb_in_description: string;
  product_thumb_shipmod: string;
  press_latest_post: string;
  store_small: string;
  store_large: string;
  store_hub_small: string;
  store_hub_large: string;
  store_slideshow_small: string;
  store_slideshow_large: string;
  store_slideshow_small_zoom: string;
  store_slideshow_large_zoom: string;
  store_thumb_listing_small: string;
  store_thumb_sku_detail: string;
  store_upgrade_half: string;
  sku_widget_thumbnail: string;
  sku_widget_modal: string;
  avatar: string;
  banner: string;
  cover: string;
  logo: string;
  icon: string;
  background_blur: string;
  texture: string;
  hub_large: string;
  hub_medium: string;
  hub_small: string;
  hub_tile: string;
  wallpaper_3840x2160: string;
  wallpaper_1920x1080: string;
  wallpaper_512x384: string;
  wsc_event_thumb: string;
  manufacturer_logo_xs: string;
}

export interface RSIStarmapCelestialObjectSourceStream
{
  progressive: string;
}

export interface RSIStarmapCelestialObjectChildShaderData
{
  orbitalMin: number;
  orbitalMax: number;
  orbitalFactor: number;
  fullturn: number;
  radius: number;
}

export interface RSIStarmapCelestialObjectSubtype
{
  id: number;
  name: string;
  type: string;
}

export interface RSIStarmapCelestialObjectResultsetShaderData
{
  orbitalMin: number;
  orbitalMax: number;
  orbitalFactor: number;
  highlight?: RSIStarmapCelestialObjectHighlight;
  radius: number;
  sun?: RSIStarmapCelestialObjectSun;
}

export interface RSIStarmapCelestialObjectHighlight
{
  color1: string;
  color2: string;
  alpha: number;
  atmosphere1: number;
  atmosphere2: number;
  atmosphere3: number;
  scaleMin: number;
  scaleMax: number;
  scalePeriod: number;
}

export interface RSIStarmapCelestialObjectSun
{
  color1: string;
  color2: string;
  flare1: number;
  flare2: number;
  flare3: number;
  flare4: number;
  flare5: number;
  flare6: number;
  sphere: number;
  texture: number;
  corona: number;
  glow: number;
  alpha: number;
  rotation1: number;
  rotation2: number;
  map: string;
  iterations: number;
  scaleMin: number;
  scaleMax: number;
  scalePeriod: number;
}