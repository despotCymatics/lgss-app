const API_BASE_URL = process.env.REACT_APP_LP_API_BASE_URL || ''
const AUTH = process.env.REACT_APP_LP_AUTH || 'default_token'

type Payload = Record<string, string | number>;

interface ApiResponse {
  message: string;
  success: boolean;
  response: any;
  data?: any;
}

export interface GetRequest {
  path: string, 
  payload?: Payload
}

export const getData = async <T>(request: GetRequest): Promise<ApiResponse> => {
  const queryParams = new URLSearchParams();

  if (request.payload) {
    for (const [key, value] of Object.entries(request.payload)) {
      queryParams.append(key, value.toString());
    }
  }

  const url = `${API_BASE_URL}/${request.path}?${queryParams.toString()}`;
  const options = {
    method: 'GET',
    headers: {
      Authorization: AUTH,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${request.path}`);
    }

    const resultJson: ApiResponse = await response.json();
    return resultJson;
  } catch (error:any) {
    console.error(`Error fetching data for ${request.path}:`, error.message);
    throw error;
  }
};

export const fetchCampaigns = async (verticalID: string) => {
  try {
    const result = await getData<GetRequest>({
      path: 'campaigns/getAll.do',
      payload: {
        verticalID,
        limit: 5,
        status: 'Active',
      }
    });

    if (result.success) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

export const fetchCampaignInfo = async (id: number) => {
  try {
    const result = await getData<GetRequest>({
      path: 'campaigns/getBasicInfo.do',
      payload: {
        campaignID: id,
      }
    });

    if (result.success) {
      return result.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  } 
};

export const fetchOffers = async (verticalID: string, advertiserId?:string) => {
  try {
    const result = await getData<GetRequest>({
      path: 'offers/getAll.do',
      payload: {
        verticalID,
        limit: 250,
        status: 'Active',
        revenueModel: 'Revenue Per Lead',
        payoutModel: 'Pay Per Lead',
        advertiserID: advertiserId ?? '',
      }
    });

    if (result.success) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

export const fetchContractFieldRevenueRules = async () => {
  try {
    const result = await getData<GetRequest>({
      path: 'contractFieldRevenueRules/getAll.do'
    });

    if (result.success && result.response.data.length > 0) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

export const fetchContracts = async (verticalID: string, advertiserId:string) => {
  try {
    const result = await getData<GetRequest>({
      path: 'contractFieldRevenueRules/getAll.do',
      payload: {
        verticalID,
        advertiserID: advertiserId,
      }
    });

    if (result.success && result.response.data.length > 0) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};


const fetchAffiliates = async () => {
  try {
    const result = await getData<GetRequest>({
      path: 'affiliates/getAll.do'
    });

    if (result.success && result.response.data.length > 0) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};
