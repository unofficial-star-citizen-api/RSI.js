import type { RSIResourceMeta } from '@/types/resource-meta.interface';

export interface RSIShipSearch
{
  readonly id: number;
  readonly afterburner_speed: number | null;
  readonly beam: number;
  readonly cargocapacity: number;
  readonly chassis_id: number;
  readonly height: number;
  readonly length: number;
  readonly manufacturer_id: number;
  readonly mass: number | null;
  readonly max_crew: number;
  readonly min_crew: number;
  readonly pitch_max: number | null;
  readonly production_note: null | string;
  readonly production_status: RSIShipProductionStatus;
  readonly roll_max: number | null;
  readonly scm_speed: number | null;
  readonly size: RSIShipSizeEnum | null;
  readonly time_modified: string;
  readonly type: string;
  readonly xaxis_acceleration: null;
  readonly yaw_max: number | null;
  readonly yaxis_acceleration: null;
  readonly zaxis_acceleration: null;
  readonly description: null | string;
  readonly focus: string;
  readonly name: string;
  readonly meta: RSIResourceMeta;
  readonly manufacturer: RSIShipManufacturer;
  readonly media: RSIShipMedia[];
  readonly 'time_modified.unfiltered': string;
  readonly compiled: RSIShipCompiled;
  price: number;
}

export interface RSIShipCompiled
{
  readonly RSIAvionic: RSIShipAvionic;
  readonly RSIPropulsion: RSIShipPropulsion;
  readonly RSIThruster: RSIShipThruster;
  readonly RSIModular: RSIShipModular;
  readonly RSIWeapon: RSIShipWeapon;
}

export interface RSIShipAvionic
{
  readonly radar: RSIShipAvionicRadar[];
  readonly computers: RSIShipAvionicComputer[];
}

export interface RSIShipAvionicComputer
{
  readonly type: string;
  readonly name: string;
  readonly mounts: string;
  readonly component_size: string;
  readonly size: string;
  readonly details: string;
  readonly quantity: string;
  readonly manufacturer: string;
  readonly component_class: RSIShipComponentClass;
}

export enum RSIShipComponentClass
{
  RSIAvionic = 'RSIAvionic',
  RSIModular = 'RSIModular',
  RSIPropulsion = 'RSIPropulsion',
  RSIWeapon = 'RSIWeapon',
}

export interface RSIShipAvionicRadar
{
  readonly type: RSIShipAvionicRadarRadarType;
  readonly name: string;
  readonly mounts: number | string;
  readonly component_size: string;
  readonly size: string;
  readonly details: null | string;
  readonly quantity: number | string;
  readonly manufacturer: null | string;
  readonly component_class: RSIShipComponentClass;
  readonly loadout?: RSIShipAvionicRadarLoadout[] | null;
}

export interface RSIShipAvionicRadarLoadout
{
  readonly name: string;
  readonly size: number;
  readonly count: number;
}

export enum RSIShipAvionicRadarRadarType
{
  Coolers = 'coolers',
  FuelTanks = 'fuel_tanks',
  Missiles = 'missiles',
  PowerPlants = 'power_plants',
  Radar = 'radar',
  ShieldGenerators = 'shield_generators',
  Turrets = 'turrets',
}

export interface RSIShipModular
{
  readonly power_plants: RSIShipAvionicRadar[];
  readonly coolers: RSIShipAvionicRadar[];
  readonly shield_generators: RSIShipAvionicRadar[];
  readonly life_support?: RSIShipLifeSupport[];
}

export interface RSIShipLifeSupport
{
  readonly type: RSIShipLifeSupportType;
  readonly name: string;
  readonly mounts: number;
  readonly component_size: string;
  readonly size: string;
  readonly details: null;
  readonly quantity: number;
  readonly manufacturer: null;
  readonly component_class: RSIShipComponentClass;
  readonly loadout: RSIShipAvionicRadarLoadout[] | null;
}

export enum RSIShipLifeSupportType
{
  JumpModules = 'jump_modules',
  LifeSupport = 'life_support',
  QuantumDrives = 'quantum_drives',
  QuantumFuelTanks = 'quantum_fuel_tanks',
  UtilityItems = 'utility_items',
  Weapons = 'weapons',
}

export interface RSIShipPropulsion
{
  readonly fuel_tanks: RSIShipAvionicRadar[];
  readonly quantum_drives: RSIShipLifeSupport[];
  readonly jump_modules: RSIShipLifeSupport[];
  readonly quantum_fuel_tanks: RSIShipLifeSupport[];
}

export interface RSIShipThruster
{
  readonly main_thrusters: unknown[];
  readonly maneuvering_thrusters: unknown[];
}

export interface RSIShipWeapon
{
  readonly weapons: RSIShipLifeSupport[];
  readonly turrets: RSIShipAvionicRadar[];
  readonly missiles: RSIShipAvionicRadar[];
  readonly utility_items: RSIShipLifeSupport[];
}

export interface RSIShipManufacturer
{
  readonly id: number;
  readonly code: string;
  readonly description: null | string;
  readonly known_for: null | string;
  readonly name: string;
  readonly media: RSIShipMedia[];
}

export interface RSIShipMedia
{
  readonly id: number;
  readonly cover_data: null;
  readonly depot: RSIShipMediaDepot;
  readonly depot_status: RSIShipMediaDepotStatus;
  readonly derived_data: RSIShipMediaDerivedData;
  readonly distant_id: null;
  readonly distant_source: null;
  readonly publish_end: null;
  readonly publish_start: null;
  readonly purpose: RSIShipMediaPurpose;
  readonly slug: string;
  readonly source_duration: null;
  readonly source_extension: RSIShipMediaSourceExtension;
  readonly source_name: string;
  readonly status: RSIShipMediaStatus;
  readonly tag_string: string;
  readonly time_modified: string;
  readonly type: RSIShipMediaMediaType;
  readonly source_url: string;
  readonly source_stream: RSIShipMediaSourceStream;
  readonly images: RSIShipMediaImages;
  readonly 'membership.id': number;
  readonly 'membership.slot': RSIShipMediaMembershipSlot;
}

export enum RSIShipMediaDepot
{
  LocalMedia = 'LOCAL_MEDIA',
  S3MediaProd = 'S3MediaProd',
}

export enum RSIShipMediaDepotStatus
{
  R = 'R',
}

export interface RSIShipMediaDerivedData
{
  readonly sizes: RSIShipMediaDerivedDataSize;
}

export interface RSIShipMediaDerivedDataSize
{
  readonly [key: string]: RSIShipSizeValue;
}

export interface RSIShipSizeValue
{
  readonly width: number;
  readonly height: RSIShipSizeValueHeightEnum | number | null;
  readonly mode: RSIShipSizeValueMode;
  readonly delete?: RSIShipSizeValueDelete;
}

export enum RSIShipSizeValueDelete
{
  The11 = '1--1',
}

export enum RSIShipSizeValueHeightEnum
{
  Empty = '',
  Height = '\\>',
}

export enum RSIShipSizeValueMode
{
  Resize = 'resize',
  ResizeCrop = 'resize-crop',
}

export interface RSIShipMediaImages
{
  readonly heap_note: string;
  readonly heap_thumb: string;
  readonly heap_infobox: string;
  readonly post_section_header: string;
  readonly channel_item_full: string;
  readonly home_transmissions_item_expanded: string;
  readonly subscribers_vault_thumbnail: string;
  readonly slideshow: string;
  readonly slideshow_pager: string;
  readonly slideshow_wide: string;
  readonly vault_thumb: string;
  readonly post: string;
  readonly wallpaper_thumb: string;
  readonly product_thumb_large: string;
  readonly product_thumb_medium_and_small: string;
  readonly component_description: string;
  readonly product_thumb_in_description: string;
  readonly product_thumb_shipmod: string;
  readonly press_latest_post: string;
  readonly store_small: string;
  readonly store_large: string;
  readonly store_hub_small: string;
  readonly store_hub_large: string;
  readonly store_slideshow_small: string;
  readonly store_slideshow_large: string;
  readonly store_slideshow_small_zoom: string;
  readonly store_slideshow_large_zoom: string;
  readonly store_thumb_listing_small: string;
  readonly store_thumb_sku_detail: string;
  readonly store_upgrade_half: string;
  readonly sku_widget_thumbnail: string;
  readonly sku_widget_modal: string;
  readonly avatar: string;
  readonly banner: string;
  readonly cover: string;
  readonly logo: string;
  readonly icon: string;
  readonly background_blur: string;
  readonly texture: string;
  readonly hub_large: string;
  readonly hub_medium: string;
  readonly hub_small: string;
  readonly hub_tile: string;
  readonly wallpaper_3840x2160: string;
  readonly wallpaper_1920x1080: string;
  readonly wallpaper_512x384: string;
  readonly wsc_event_thumb: string;
  readonly manufacturer_logo_xs: string;
}

export enum RSIShipMediaMembershipSlot
{
  Icon = 'icon',
  Thumbnail = 'thumbnail',
}

export enum RSIShipMediaPurpose
{
  Full = 'full',
}

export enum RSIShipMediaSourceExtension
{
  Jpg = 'jpg',
  PNG = 'png',
}

export interface RSIShipMediaSourceStream
{
  readonly progressive: string;
}

export enum RSIShipMediaStatus
{
  P = 'P',
}

export enum RSIShipMediaMediaType
{
  I = 'I',
}

export enum RSIShipProductionStatus
{
  FlightReady = 'flight-ready',
}

export enum RSIShipSizeEnum
{
  Large = 'Large',
  Medium = 'Medium',
  Small = 'Small',
  Vehicle = 'vehicle',
}
