const API_BASE_URL = process.env.REACT_APP_LP_API_BASE_URL || '';
const AUTH = process.env.REACT_APP_LP_AUTH || 'default_token';

type Payload = Record<string, string | number>;

interface ApiResponse {
  message: string;
  success: boolean;
  response?: any;
  data?: any;
}

export interface Request {
  path: string;
  payload?: Payload;
}

export const postData = async <T>(request: Request): Promise<ApiResponse> => {
  const queryParams = new URLSearchParams();

  if (request.payload) {
    for (const [key, value] of Object.entries(request.payload)) {
      queryParams.append(key, value.toString());
    }
  }

  const url = `${API_BASE_URL}/${request.path}?${queryParams.toString()}`;
  const options = {
    method: 'POST',
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
  } catch (error: any) {
    console.error(`Error fetching data for ${request.path}:`, error.message);
    throw error;
  }
};

export const getData = async <T>(request: Request): Promise<ApiResponse> => {
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
  } catch (error: any) {
    console.error(`Error fetching data for ${request.path}:`, error.message);
    throw error;
  }
};

// LP API GET Calls
export const fetchVerticals = async () => {
  try {
    const result = await getData<Request>({
      path: 'verticals/getAll.do',
    });

    if (result.success && result.response.data.length > 0) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

export const fetchCampaigns = async (
  verticalID: string,
  offerID: string,
  start?: number
) => {
  try {
    const result = await getData<Request>({
      path: 'campaigns/getAll.do',
      payload: {
        verticalID,
        offerID,
        limit: 4,
        status: 'Active',
        start: start ?? 0,
      },
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
    const result = await getData<Request>({
      path: 'campaigns/getBasicInfo.do',
      payload: {
        campaignID: id,
      },
    });

    if (result.success) {
      return result.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

export const fetchOffers = async (
  verticalID: string,
  advertiserId?: string
) => {
  try {
    const result = await getData<Request>({
      path: 'offers/getAll.do',
      payload: {
        verticalID,
        limit: 250,
        status: 'Active',
        revenueModel: 'Revenue Per Lead',
        payoutModel: 'Pay Per Lead',
        advertiserID: advertiserId ?? '',
      },
    });

    if (result.success) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

export const fetchContracts = async (
  lpType: string,
  verticalID: string,
  advertiserID: string
) => {
  let path = 'leadDistributionContracts/getAll.do';
  if (lpType === 'calls') {
    path = 'callRoutingContracts/getAll.do';
  }
     
  try {
    const result = await getData<Request>({
      path: path,
      payload: {
        verticalID,
        advertiserID,
        status: 'Active',
      },
    });

    if (result.success && result.response.data.length > 0) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

export const fetchSchedule = async (contractID: number) => {
  try {
    const result = await getData<Request>({
      path: 'leadDistributionContracts/getSchedule.do',
      payload: {
        contractID,
      },
    });

    if (result.success && result.response.data.length > 0) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// LP API POST Calls
//https://api.leadspedia.com/core/v2/contractFieldRevenueRules/create.do?contractID=22&fieldID=83&fieldValue=5&price=1


// LEAD RULES - GET CONTRACT FIELD REVENUE RULES
export const fetchContractLeadFieldRevenueRules = async (contractId: number) => {
  try {
    const result = await getData<Request>({
      path: 'contractFieldRevenueRules/getAll.do',
      payload: {
        contractID: contractId,
      },
    });

    if (result.success) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// LEAD RULES - CREATE CONTRACT FIELD REVENUE RULES
export const createContractLeadFieldRevenueRules = async (
  contractID: number,
  fieldID: number,
  fieldValue: string,
  price: number
) => {
  try {
    const result = await postData<Request>({
      path: 'contractFieldRevenueRules/create.do',
      payload: {
        contractID,
        fieldID,
        fieldValue,
        price,
      },
    });

    if (result.success) {
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// LEAD RULES - UPDATE CONTRACT FIELD REVENUE RULES
export const updateContractLeadFieldRevenueRules = async (
  fieldRevenueRuleID: number,
  fieldID: number,
  fieldValue: string,
  price: number
) => {
  try {
    const result = await postData<Request>({
      path: 'contractFieldRevenueRules/update.do',
      payload: {
        fieldRevenueRuleID,
        fieldID,
        fieldValue,
        price,
      },
    });

    if (result.success) {
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// CALL RULES - GET CONTRACT FIELD REVENUE RULES
export const fetchContractCallFieldRevenueRules = async (contractId: number) => {
  try {
    const result = await getData<Request>({
      path: 'contractCallFieldRevenueRules/getAll.do',
      payload: {
        contractID: contractId,
      },
    });

    if (result.success) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// CALL RULES - CREATE CONTRACT FIELD REVENUE RULES
export const createContractCallFieldRevenueRules = async (
  contractID: number,
  fieldID: number,
  fieldValue: string,
  price: number
) => {
  try {
    const result = await postData<Request>({
      path: 'contractCallFieldRevenueRules/create.do',
      payload: {
        contractID,
        fieldID,
        fieldValue,
        price,
      },
    });

    if (result.success) {
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// LEAD RULES - UPDATE CONTRACT FIELD REVENUE RULES
export const updateContractCallFieldRevenueRules = async (
  fieldRevenueRuleID: number,
  fieldID: number,
  fieldValue: string,
  price: number
) => {
  try {
    const result = await postData<Request>({
      path: 'contractCallFieldRevenueRules/update.do',
      payload: {
        fieldRevenueRuleID,
        fieldID,
        fieldValue,
        price,
      },
    });

    if (result.success) {
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// ROUTING RULES - GET ALL (Toggle)
export const fetchRules = async (advertiserID: string) => {
  try {
    const result = await getData<Request>({
      path: 'leadRoutingRules/getAll.do',
      payload: {
        advertiserID,
        status: 'Active',
      },
    });

    if (result.success) {
      return result.response.data;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// ROUTING RULES - CREATE (Toggle)
export const createRoutingRule = async (
  buyerID: number,
  campaignID: number,
  contractID: number,
  affiliateID: string
) => {
  try {
    const result = await postData<Request>({
      path: 'leadRoutingRules/create.do',
      payload: {
        buyerID,
        contractID,
        affiliateID,
        campaignID,
        rule: 'Block',
      },
    });

    if (result.success) {
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};

// ROUTING RULES - DELETE (Toggle)
export const deleteRoutingRule = async (leadRoutingID: number) => {
  try {
    const result = await postData<Request>({
      path: 'leadRoutingRules/delete.do',
      payload: {
        leadRoutingID,
      },
    });

    if (result.success) {
      return result;
    }
  } catch (error: any) {
    console.error('Error fetching data:', error.message);
  }
};
