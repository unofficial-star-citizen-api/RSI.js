import type { RSIResourceMeta } from '@/types/resource-meta.interface';

/**
 * A ship returned by {@link Ships}: its ship-matrix specs plus its store price.
 *
 * Field names are kept as returned by the RSI ship matrix (snake_case).
 *
 * @category Types/Ships
 */
export interface RSIShipSearch
{
  /** Ship-matrix identifier */
  readonly id: number;
  /** Afterburner speed in m/s */
  readonly afterburner_speed: number | null;
  /** Width in metres */
  readonly beam: number;
  /** Cargo capacity in SCU */
  readonly cargocapacity: number;
  /** Identifier of the ship chassis, shared by variants */
  readonly chassis_id: number;
  /** Height in metres */
  readonly height: number;
  /** Length in metres */
  readonly length: number;
  /** Identifier of the manufacturer */
  readonly manufacturer_id: number;
  /** Mass in kilograms */
  readonly mass: number | null;
  /** Maximum crew */
  readonly max_crew: number;
  /** Minimum crew */
  readonly min_crew: number;
  /** Maximum pitch rate in degrees per second */
  readonly pitch_max: number | null;
  /** Free-text note about the production status */
  readonly production_note: null | string;
  /** Production status, for example `flight-ready` */
  readonly production_status: RSIShipProductionStatus;
  /** Maximum roll rate in degrees per second */
  readonly roll_max: number | null;
  /** SCM (combat) speed in m/s */
  readonly scm_speed: number | null;
  /** Size category */
  readonly size: RSIShipSizeEnum | null;
  /** Last modification date in the ship matrix */
  readonly time_modified: string;
  /** Ship role type, for example `combat` or `transport` */
  readonly type: string;
  /** Not provided by RSI */
  readonly xaxis_acceleration: null;
  /** Maximum yaw rate in degrees per second */
  readonly yaw_max: number | null;
  /** Not provided by RSI */
  readonly yaxis_acceleration: null;
  /** Not provided by RSI */
  readonly zaxis_acceleration: null;
  /** Marketing description */
  readonly description: null | string;
  /** Career focus of the ship */
  readonly focus: string;
  /** Ship name, for example `Cutlass Black` */
  readonly name: string;
  /** Resource metadata; `meta.url` is the ship's store page */
  readonly meta: RSIResourceMeta;
  /** Manufacturer details */
  readonly manufacturer: RSIShipManufacturer;
  /** Ship images */
  readonly media: RSIShipMedia[];
  /** Last modification date, unformatted */
  readonly 'time_modified.unfiltered': string;
  /** Default components, grouped by component class */
  readonly compiled: RSIShipCompiled;
  /** Standalone store price (MSRP) in USD, set even when the ship is not for sale; `0` when the store has no price */
  price: number;
  /** Whether the ship can currently be bought standalone in the store */
  readonly purchasable: boolean;
}

/**
 * Ship components grouped by component class, as returned by the ship matrix.
 *
 * @category Types/Ships
 */
export interface RSIShipCompiled
{
  readonly RSIAvionic: RSIShipAvionic;
  readonly RSIPropulsion: RSIShipPropulsion;
  readonly RSIThruster: RSIShipThruster;
  readonly RSIModular: RSIShipModular;
  readonly RSIWeapon: RSIShipWeapon;
}

/**
 * Avionics components: radars and computers.
 *
 * @category Types/Ships
 */
export interface RSIShipAvionic
{
  readonly radar: RSIShipAvionicRadar[];
  readonly computers: RSIShipAvionicComputer[];
}

/**
 * A computer component.
 *
 * @category Types/Ships
 */
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

/**
 * Component classes used by the ship matrix.
 *
 * @category Types/Ships
 */
export enum RSIShipComponentClass
{
  RSIAvionic = 'RSIAvionic',
  RSIModular = 'RSIModular',
  RSIPropulsion = 'RSIPropulsion',
  RSIWeapon = 'RSIWeapon',
}

/**
 * A ship component (radar, power plant, cooler, shield, fuel tank, turret, missile...) as listed in the ship matrix.
 *
 * @category Types/Ships
 */
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

/**
 * Default loadout of a component slot.
 *
 * @category Types/Ships
 */
export interface RSIShipAvionicRadarLoadout
{
  readonly name: string;
  readonly size: number;
  readonly count: number;
}

/**
 * Component types for {@link RSIShipAvionicRadar}.
 *
 * @category Types/Ships
 */
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

/**
 * Modular components: power plants, coolers, shield generators and life support.
 *
 * @category Types/Ships
 */
export interface RSIShipModular
{
  readonly power_plants: RSIShipAvionicRadar[];
  readonly coolers: RSIShipAvionicRadar[];
  readonly shield_generators: RSIShipAvionicRadar[];
  readonly life_support?: RSIShipLifeSupport[];
}

/**
 * A ship component (life support, quantum drive, jump module, weapon, utility item...) as listed in the ship matrix.
 *
 * @category Types/Ships
 */
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

/**
 * Component types for {@link RSIShipLifeSupport}.
 *
 * @category Types/Ships
 */
export enum RSIShipLifeSupportType
{
  JumpModules = 'jump_modules',
  LifeSupport = 'life_support',
  QuantumDrives = 'quantum_drives',
  QuantumFuelTanks = 'quantum_fuel_tanks',
  UtilityItems = 'utility_items',
  Weapons = 'weapons',
}

/**
 * Propulsion components: fuel tanks, quantum drives, jump modules and quantum fuel tanks.
 *
 * @category Types/Ships
 */
export interface RSIShipPropulsion
{
  readonly fuel_tanks: RSIShipAvionicRadar[];
  readonly quantum_drives: RSIShipLifeSupport[];
  readonly jump_modules: RSIShipLifeSupport[];
  readonly quantum_fuel_tanks: RSIShipLifeSupport[];
}

/**
 * Thrusters. The ship matrix currently returns them untyped.
 *
 * @category Types/Ships
 */
export interface RSIShipThruster
{
  readonly main_thrusters: unknown[];
  readonly maneuvering_thrusters: unknown[];
}

/**
 * Weapon components: weapons, turrets, missiles and utility items.
 *
 * @category Types/Ships
 */
export interface RSIShipWeapon
{
  readonly weapons: RSIShipLifeSupport[];
  readonly turrets: RSIShipAvionicRadar[];
  readonly missiles: RSIShipAvionicRadar[];
  readonly utility_items: RSIShipLifeSupport[];
}

/**
 * Ship manufacturer, as returned by the ship matrix.
 *
 * @category Types/Ships
 */
export interface RSIShipManufacturer
{
  readonly id: number;
  readonly code: string;
  readonly description: null | string;
  readonly known_for: null | string;
  readonly name: string;
  readonly media: RSIShipMedia[];
}

/**
 * An image of a ship or manufacturer, as returned by the ship matrix.
 *
 * @category Types/Ships
 */
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

/**
 * Storage backend of a media file.
 *
 * @category Types/Ships
 */
export enum RSIShipMediaDepot
{
  LocalMedia = 'LOCAL_MEDIA',
  S3MediaProd = 'S3MediaProd',
}

/**
 * Storage status of a media file.
 *
 * @category Types/Ships
 */
export enum RSIShipMediaDepotStatus
{
  R = 'R',
}

/**
 * Generated variants of a media file.
 *
 * @category Types/Ships
 */
export interface RSIShipMediaDerivedData
{
  readonly sizes: RSIShipMediaDerivedDataSize;
}

/**
 * Generated image sizes, keyed by size name.
 *
 * @category Types/Ships
 */
export interface RSIShipMediaDerivedDataSize
{
  readonly [key: string]: RSIShipSizeValue;
}

/**
 * Dimensions and resize mode of a generated image.
 *
 * @category Types/Ships
 */
export interface RSIShipSizeValue
{
  readonly width: number;
  readonly height: RSIShipSizeValueHeightEnum | number | null;
  readonly mode: RSIShipSizeValueMode;
  readonly delete?: RSIShipSizeValueDelete;
}

/**
 * Raw ship-matrix value.
 *
 * @category Types/Ships
 */
export enum RSIShipSizeValueDelete
{
  The11 = '1--1',
}

/**
 * Raw ship-matrix value.
 *
 * @category Types/Ships
 */
export enum RSIShipSizeValueHeightEnum
{
  Empty = '',
  Height = '\\>',
}

/**
 * Resize mode of a generated image.
 *
 * @category Types/Ships
 */
export enum RSIShipSizeValueMode
{
  Resize = 'resize',
  ResizeCrop = 'resize-crop',
}

/**
 * Image URLs of a media file, keyed by RSI image format.
 *
 * @category Types/Ships
 */
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

/**
 * Slot of a media file in its gallery.
 *
 * @category Types/Ships
 */
export enum RSIShipMediaMembershipSlot
{
  Icon = 'icon',
  Thumbnail = 'thumbnail',
}

/**
 * Purpose of a media file.
 *
 * @category Types/Ships
 */
export enum RSIShipMediaPurpose
{
  Full = 'full',
}

/**
 * File extension of a media source.
 *
 * @category Types/Ships
 */
export enum RSIShipMediaSourceExtension
{
  Jpg = 'jpg',
  PNG = 'png',
}

/**
 * Streaming URLs of a media source.
 *
 * @category Types/Ships
 */
export interface RSIShipMediaSourceStream
{
  readonly progressive: string;
}

/**
 * Publication status of a media file.
 *
 * @category Types/Ships
 */
export enum RSIShipMediaStatus
{
  P = 'P',
}

/**
 * Type of a media file.
 *
 * @category Types/Ships
 */
export enum RSIShipMediaMediaType
{
  I = 'I',
}

/**
 * Production status of a ship, as returned by the ship matrix.
 *
 * @category Types/Ships
 */
export enum RSIShipProductionStatus
{
  FlightReady = 'flight-ready',
}

/**
 * Ship size, as returned by the ship matrix (capitalization varies).
 *
 * @category Types/Ships
 */
export enum RSIShipSizeEnum
{
  Large = 'Large',
  Medium = 'Medium',
  Small = 'Small',
  Vehicle = 'vehicle',
}
