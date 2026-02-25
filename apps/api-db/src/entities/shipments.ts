import { Shipment } from '@uai/shared';

export const SHIPMENTS: Omit<Shipment, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'shp-1',
    state: ['inTransit'],
    carrier: 'UPS',
    origin: {
      city: 'Warsaw',
      country: 'PL',
      addressLine: 'ul. Marszałkowska 1',
      position: [52.23, 21.01],
    },
    destination: {
      city: 'Berlin',
      country: 'DE',
      addressLine: 'Friedrichstraße 123',
      position: [52.52, 13.4],
    },
    estimatedDeliveryDate: '2025-02-22T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-22T09:00:00.000Z',
    actualPosition: [52.4, 16.9], // between Warsaw and Berlin (Poznań area)
  },
  {
    id: 'shp-2',
    state: ['inTransit', 'delayed'],
    carrier: 'DHL',
    origin: {
      city: 'Kraków',
      country: 'PL',
      addressLine: 'ul. Floriańska 15',
      position: [50.06, 19.94],
    },
    destination: {
      city: 'Munich',
      country: 'DE',
      addressLine: 'Marienplatz 1',
      position: [48.14, 11.58],
    },
    estimatedDeliveryDate: '2025-02-20T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-19T09:00:00.000Z',
    delayReason: 'Customs clearance',
    actualPosition: [49.5, 17.5], // near PL/DE border (customs)
  },
  {
    id: 'shp-3',
    state: ['delivered'],
    carrier: 'FedEx',
    origin: {
      city: 'Gdańsk',
      country: 'PL',
      addressLine: 'Długi Targ 1',
      position: [54.35, 18.65],
    },
    destination: {
      city: 'Amsterdam',
      country: 'NL',
      addressLine: 'Damrak 1',
      position: [52.37, 4.89],
    },
    estimatedDeliveryDate: '2025-02-18T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-18T09:00:00.000Z',
    finalDeliveryDate: '2025-02-18T16:45:00.000Z',
    actualPosition: [52.37, 4.89], // Amsterdam (delivered at destination)
  },
  {
    id: 'shp-4',
    state: ['inTransit'],
    carrier: 'InPost',
    origin: {
      city: 'Wrocław',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [51.11, 17.04],
    },
    destination: {
      city: 'Prague',
      country: 'CZ',
      addressLine: 'Staroměstské nám. 1',
      position: [50.08, 14.44],
    },
    estimatedDeliveryDate: '2025-02-23T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-23T09:00:00.000Z',
    actualPosition: [50.5, 15.5], // between Wrocław and Prague
  },
  {
    id: 'shp-5',
    state: ['inTransit', 'delayed'],
    carrier: 'DPD',
    origin: {
      city: 'Poznań',
      country: 'PL',
      addressLine: 'Stary Rynek 1',
      position: [52.41, 16.93],
    },
    destination: {
      city: 'Vienna',
      country: 'AT',
      addressLine: 'Stephansplatz 1',
      position: [48.21, 16.37],
    },
    estimatedDeliveryDate: '2025-02-21T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-20T09:00:00.000Z',
    delayReason: 'Weather conditions',
    actualPosition: [50.0, 17.0], // between Poznań and Vienna (delayed)
  },
  {
    id: 'shp-6',
    state: ['inTransit'],
    carrier: 'UPS',
    origin: {
      city: 'Łódź',
      country: 'PL',
      addressLine: 'Piotrkowska 1',
      position: [51.77, 19.46],
    },
    destination: {
      city: 'Zurich',
      country: 'CH',
      addressLine: 'Bahnhofstrasse 1',
      position: [47.38, 8.54],
    },
    estimatedDeliveryDate: '2025-02-24T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-24T09:00:00.000Z',
    actualPosition: [50.5, 12.0], // between Łódź and Zurich
  },
  {
    id: 'shp-7',
    state: ['delivered'],
    carrier: 'DHL',
    origin: {
      city: 'Katowice',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [50.26, 19.02],
    },
    destination: {
      city: 'Brussels',
      country: 'BE',
      addressLine: 'Grand Place 1',
      position: [50.85, 4.35],
    },
    estimatedDeliveryDate: '2025-02-19T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-19T09:00:00.000Z',
    finalDeliveryDate: '2025-02-19T14:30:00.000Z',
    actualPosition: [50.85, 4.35], // Brussels (delivered)
  },
  {
    id: 'shp-8',
    state: ['inTransit'],
    carrier: 'FedEx',
    origin: {
      city: 'Szczecin',
      country: 'PL',
      addressLine: 'Plac Solidarności 1',
      position: [53.43, 14.55],
    },
    destination: {
      city: 'Copenhagen',
      country: 'DK',
      addressLine: 'Strøget 1',
      position: [55.68, 12.57],
    },
    estimatedDeliveryDate: '2025-02-25T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-25T09:00:00.000Z',
    actualPosition: [54.5, 13.5], // between Szczecin and Copenhagen
  },
  {
    id: 'shp-9',
    state: ['inTransit', 'delayed'],
    carrier: 'InPost',
    origin: {
      city: 'Lublin',
      country: 'PL',
      addressLine: 'Plac Litewski 1',
      position: [51.25, 22.57],
    },
    destination: {
      city: 'Budapest',
      country: 'HU',
      addressLine: 'Váci utca 1',
      position: [47.5, 19.04],
    },
    estimatedDeliveryDate: '2025-02-22T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-21T09:00:00.000Z',
    delayReason: 'Route optimization',
    actualPosition: [49.0, 20.0], // between Lublin and Budapest
  },
  {
    id: 'shp-10',
    state: ['delivered'],
    carrier: 'DPD',
    origin: {
      city: 'Białystok',
      country: 'PL',
      addressLine: 'Rynek Kościuszki 1',
      position: [53.13, 23.16],
    },
    destination: {
      city: 'Vilnius',
      country: 'LT',
      addressLine: 'Gedimino pr. 1',
      position: [54.69, 25.28],
    },
    estimatedDeliveryDate: '2025-02-20T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-20T09:00:00.000Z',
    finalDeliveryDate: '2025-02-20T10:15:00.000Z',
    actualPosition: [54.69, 25.28], // Vilnius (delivered)
  },
  {
    id: 'shp-11',
    state: ['inTransit'],
    carrier: 'UPS',
    origin: {
      city: 'Gdynia',
      country: 'PL',
      addressLine: 'Skwer Kościuszki 1',
      position: [54.52, 18.53],
    },
    destination: {
      city: 'Stockholm',
      country: 'SE',
      addressLine: 'Drottninggatan 1',
      position: [59.33, 18.07],
    },
    estimatedDeliveryDate: '2025-02-26T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-26T09:00:00.000Z',
    actualPosition: [57.0, 18.0], // between Gdynia and Stockholm
  },
  {
    id: 'shp-12',
    state: ['inTransit'],
    carrier: 'DHL',
    origin: {
      city: 'Toruń',
      country: 'PL',
      addressLine: 'Rynek Staromiejski 1',
      position: [53.01, 18.6],
    },
    destination: {
      city: 'Hamburg',
      country: 'DE',
      addressLine: 'Mönckebergstraße 1',
      position: [53.55, 10.0],
    },
    estimatedDeliveryDate: '2025-02-23T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-23T09:00:00.000Z',
    actualPosition: [53.3, 14.0], // between Toruń and Hamburg
  },
  {
    id: 'shp-13',
    state: ['delivered'],
    carrier: 'FedEx',
    origin: {
      city: 'Rzeszów',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [50.04, 22.0],
    },
    destination: {
      city: 'Bratislava',
      country: 'SK',
      addressLine: 'Hlavné námestie 1',
      position: [48.14, 17.11],
    },
    estimatedDeliveryDate: '2025-02-19T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-19T09:00:00.000Z',
    finalDeliveryDate: '2025-02-19T12:00:00.000Z',
    actualPosition: [48.14, 17.11], // Bratislava (delivered)
  },
  {
    id: 'shp-14',
    state: ['inTransit', 'delayed'],
    carrier: 'InPost',
    origin: {
      city: 'Olsztyn',
      country: 'PL',
      addressLine: 'Plac Konsulatu Polskiego 1',
      position: [53.78, 20.48],
    },
    destination: {
      city: 'Tallinn',
      country: 'EE',
      addressLine: 'Raekoja plats 1',
      position: [59.44, 24.75],
    },
    estimatedDeliveryDate: '2025-02-24T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-23T09:00:00.000Z',
    delayReason: 'Ferry schedule change',
    actualPosition: [56.0, 22.0], // between Olsztyn and Tallinn
  },
  {
    id: 'shp-15',
    state: ['inTransit'],
    carrier: 'DPD',
    origin: {
      city: 'Bydgoszcz',
      country: 'PL',
      addressLine: 'Stary Rynek 1',
      position: [53.12, 18.0],
    },
    destination: {
      city: 'Rotterdam',
      country: 'NL',
      addressLine: 'Coolsingel 1',
      position: [51.92, 4.48],
    },
    estimatedDeliveryDate: '2025-02-22T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-22T09:00:00.000Z',
    actualPosition: [52.5, 11.0], // between Bydgoszcz and Rotterdam
  },
  {
    id: 'shp-16',
    state: ['delivered'],
    carrier: 'UPS',
    origin: {
      city: 'Kielce',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [50.87, 20.63],
    },
    destination: {
      city: 'Warsaw',
      country: 'PL',
      addressLine: 'Plac Zamkowy 1',
      position: [52.23, 21.01],
    },
    estimatedDeliveryDate: '2025-02-18T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-18T09:00:00.000Z',
    finalDeliveryDate: '2025-02-18T09:30:00.000Z',
    actualPosition: [52.23, 21.01], // Warsaw (delivered)
  },
  {
    id: 'shp-17',
    state: ['inTransit'],
    carrier: 'DHL',
    origin: {
      city: 'Radom',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [51.4, 21.16],
    },
    destination: {
      city: 'Paris',
      country: 'FR',
      addressLine: 'Champs-Élysées 1',
      position: [48.86, 2.35],
    },
    estimatedDeliveryDate: '2025-02-27T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-27T09:00:00.000Z',
    actualPosition: [50.0, 12.0], // between Radom and Paris
  },
  {
    id: 'shp-18',
    state: ['inTransit', 'delayed'],
    carrier: 'FedEx',
    origin: {
      city: 'Sosnowiec',
      country: 'PL',
      addressLine: 'ul. 3 Maja 1',
      position: [50.3, 19.13],
    },
    destination: {
      city: 'Milan',
      country: 'IT',
      addressLine: 'Piazza del Duomo 1',
      position: [45.46, 9.19],
    },
    estimatedDeliveryDate: '2025-02-25T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-24T09:00:00.000Z',
    delayReason: 'Alpine weather conditions',
    actualPosition: [47.0, 14.0], // between Sosnowiec and Milan
  },
  {
    id: 'shp-19',
    state: ['inTransit'],
    carrier: 'InPost',
    origin: {
      city: 'Zielona Góra',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [51.94, 15.5],
    },
    destination: {
      city: 'Dresden',
      country: 'DE',
      addressLine: 'Altmarkt 1',
      position: [51.05, 13.74],
    },
    estimatedDeliveryDate: '2025-02-21T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-21T09:00:00.000Z',
    actualPosition: [51.5, 14.5], // between Zielona Góra and Dresden
  },
  {
    id: 'shp-20',
    state: ['delivered'],
    carrier: 'DPD',
    origin: {
      city: 'Opole',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [50.67, 17.92],
    },
    destination: {
      city: 'Wrocław',
      country: 'PL',
      addressLine: 'Rynek 1',
      position: [51.11, 17.04],
    },
    estimatedDeliveryDate: '2025-02-19T17:30:00.000Z',
    originalEstimatedDeliveryDate: '2025-02-19T09:00:00.000Z',
    finalDeliveryDate: '2025-02-19T16:20:00.000Z',
    actualPosition: [51.11, 17.04], // Wrocław (delivered)
  },
];
