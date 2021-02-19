/**
 * Location methods according to https://tools.ietf.org/html/rfc4119#section-6.1
 */
export enum LocationMethod {
  /**
   * Global Positioning System
   */
  'GPS' = 'GPS',
  /**
   * GPS with assistance
   */
  'A-GPS' = 'A-GPS',
  /**
   * entered manually by an operator or user, e.g., based on subscriber billing or service location information
   */
  'Manual' = 'Manual',
  /**
   * provided by DHCP (used for wireline access networks)
   */
  'DHCP' = 'DHCP',
  /**
   * triangulated from time-of-arrival, signal strength, or similar measurements
   */
  'Triangulation' = 'Triangulation',
  /**
   * location of the cellular radio antenna
   */
  'Cell' = 'Cell',
  /**
   * 802.11 access point (used for DHCP-based provisioning over wireless access networks)
   */
  'AP-802.11' = '802.11',
}

/**
 * https://tools.ietf.org/html/rfc4119
 */
export interface CivicAddress {
  /**
   * The country is identified by the two-letter ISO 3166 code \
   * Example: US
   */
  country?: string,
  /**
   * national subdivisions (state, region, province, prefecture) \
   * Example: New York
   */
  A1?: string,
  /**
   * county parish, gun (JP), district (IN) \
   * Example: King's County
   */
  A2?: string,
  /**
   * city, township, shi (JP) \
   * Example: New York
   */
  A3?: string,
  /**
   * city division, borough, city district, ward, chou (JP) \
   * Example: Manhattan
   */
  A4?: string,
  /**
   * neighborhood, block \
   * Example: Morningside Heights
   */
  A5?: string
  /**
   * street \
   * Example: Broadway
   */
  A6?: string,
  /**
   * Leading street direction \
   * Example: N, W
   */
  PRD?: string,
  /**
   * Trailing street suffix \
   * Example: SW
   */
  POD?: string,
  /**
   * Street suffix \
   * Example: Avenue, Platz, Street
   */
  STS?: string,
  /**
   * House nmber, numberic part only. \
   * Example: 123
   */
  HNO?: string,
  /**
   * House number suffix \
   * Example: A, 1/2
   */
  HNS?: string,
  /**
   * Landmark or vanity address \
   * Example: Low Library
   */
  LMK?: string,
  /**
   * Additional location information \
   * Example: Room 543
   */
  LOC?: string,
  /**
   * Floor \
   * Example: 5
   */
  FLR?: string,
  /**
   * Name (residence, business or office occupant) \
   * Example: Joe's Barbershop
   */
  NAM?: string,
  /**
   * Postal code \
   * Example: 10027-0401
   */
  PC?: string,
}

/**
 * An interface that allows simple interaction with the more advanced PidfLo locations
 */
export interface SimpleLocation {
  /**
   * Latitude as WGS84 compatible decimal number
   */
  latitude?: number,
  /**
   * Longitude as WGS84 compatible decimal number
   */
  longitude?: number,
  /**
   * Radius (accuracy) of the given location in meters
   */
  radius?: number,
  /**
   * The method how the location was obtained by the caller's device
   */
  method?: LocationMethod,
  /**
   * The timestamp when the location was initially retreived (e.g. from the GPS sensors)
   */
  timestamp?: Date,
  /**
   * A civic address according to https://tools.ietf.org/html/rfc4119
   */
  civic?: CivicAddress,
}