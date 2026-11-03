export const SEARCH_URL = 'https://robertsspaceindustries.com/api/store/getShips';
export const MATRIX_URL = 'https://robertsspaceindustries.com/ship-matrix/index';
export const GRAPHQL_URL = 'https://robertsspaceindustries.com/graphql';

export const MOCK_SHIP = {
  id: 56,
  name: 'Cutlass Black',
  url: '/pledge/ships/cutlass/Cutlass-Black',
  afterburner_speed: '1228',
  beam: '26',
  cargocapacity: '46',
  chassis_id: 6,
  compiled: { RSIAvionic: { computers: [] } }
};

export const MOCK_STORE_SHIP = { id: '56', msrp: 11000, purchasable: true };

export const SEARCH_HTML = '<div data-ship-id="56"></div>';

export const storeResponse = (resources: unknown[], totalCount = resources.length) => ({
  status: 200,
  data: { data: { store: { search: { totalCount, resources } } } }
} as any);

export const matrixResponse = (ships: unknown[]) => ({
  status: 200,
  data: { success: 1, data: ships }
} as any);

export const searchResponse = (html: string, rowcount = 0) => ({
  status: 200,
  data: { success: 1, data: { html, rowcount } }
} as any);
