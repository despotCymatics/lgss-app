const API_BASE_URL = process.env.REACT_APP_LP_API_BASE_URL || ''
const AUTH = process.env.REACT_APP_LP_AUTH || 'default_token'
//const accountMangerID = "6393"

type Payload = Record<string, string | number>;

interface ApiResponse {
  message: string;
  success: boolean;
  response: any;
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

