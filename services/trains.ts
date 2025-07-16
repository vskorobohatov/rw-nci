import { API_URL } from "@/config";
import { getCachedData, setCachedData } from "@/helpers/cacheHelper";
import { getToken } from "@/helpers/tokenHelper";
import axios from "axios";

export interface Train {
  id?: string;
  number: string;
  name: string;
  time_in: string;
  time_out: string;
  schedule: string;
  stops: string;
  comment: string;
  [key: string]: any;
}

class TrainsServiceClass {
  private api = axios.create({
    baseURL: API_URL,
  });

  private async getAuthHeaders() {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async fetchWithCache(url: string, config: any = {}) {
    const cached = await getCachedData(url);
    try {
      if (cached) return cached;
      const response = await this.api.get(url, config);
      await setCachedData(url, response.data);
      return response.data;
    } catch (err) {
      // No internet or server error
      if (cached) return cached;
      console.error("Fetch error:", err);
      throw new Error("No data available (offline and no cache)");
    }
  }

  async getTrains(noCache = false) {
    const headers = await this.getAuthHeaders();
    if (noCache) {
      console.log("Fetching trains without cache");
      const res = await this.api.get("/trains/list.php", { headers });
      return res.data;
    } else {
      console.log("Fetching trains with cache");
      const res = await this.fetchWithCache("/trains/list.php", { headers });
      return res;
    }
  }

  async addTrain(train: Train) {
    const headers = await this.getAuthHeaders();
    const res = await this.api.post("/trains/create.php", train, { headers });
    return res.data;
  }

  async getTrainDetails(id: number | string) {
    const headers = await this.getAuthHeaders();
    const res = await this.api.get("/trains/get.php", {
      params: { id },
      headers,
    });
    return res?.data || {};
  }

  async editTrain(train: Train) {
    const headers = await this.getAuthHeaders();
    const res = await this.api.post("/trains/update.php", train, { headers });
    return res.data;
  }

  async deleteTrain(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    await this.api.post(`/trains/delete.php`, { id }, { headers });
  }
}

export const TrainsService = new TrainsServiceClass();
